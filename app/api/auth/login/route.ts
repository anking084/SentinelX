import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signJwtAccessToken, signJwtRefreshToken } from '@/lib/auth';

// Helper for simplistic IP location mockup if external API fails or is not meant to be heavily queried
async function getLocationFromIP(ip: string) {
    if (ip === '127.0.0.1' || ip === '::1') return 'Localhost';
    try {
        const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`);
        const data = await res.json();
        if (data.status === 'success') {
            return `${data.city}, ${data.country}`;
        }
    } catch {}
    return 'Unknown Location';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Get IP metadata
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown Device';
    const location = await getLocationFromIP(ipAddress);
    
    let riskScore = 0;
    
    // Check if it's off-hours (e.g., between 2 AM and 5 AM)
    const currentHour = new Date().getHours();
    if (currentHour >= 2 && currentHour <= 5) riskScore += 30;

    // Check brute force locally for this IP
    const recentFailedAttempts = await prisma.loginLog.count({
        where: {
            ipAddress,
            status: 'FAILED',
            createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) } // Last 15 mins
        }
    });

    if (recentFailedAttempts >= 5) {
        riskScore += 80;
        await prisma.securityAlert.create({
            data: {
                type: 'BRUTE_FORCE',
                description: `Múltiplas tentativas de login falhas detectadas do IP ${ipAddress}`,
                severity: 'CRITICAL',
                ipAddress
            }
        });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    let riskLevel = riskScore >= 70 ? 'CRITICAL' : riskScore >= 30 ? 'SUSPICIOUS' : 'SAFE';

    if (!user) {
        await prisma.loginLog.create({
            data: {
                emailAttempted: email,
                ipAddress,
                location,
                device: userAgent,
                status: 'FAILED',
                riskScore: riskScore + 20,
                riskLevel: (riskScore + 20) >= 70 ? 'CRITICAL' : 'SUSPICIOUS'
            }
        });
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.status !== 'ACTIVE') {
        await prisma.loginLog.create({
            data: { userId: user.id, emailAttempted: email, ipAddress, location, device: userAgent, status: 'BLOCKED', riskScore: 100, riskLevel: 'CRITICAL' }
        });
        return NextResponse.json({ error: 'User is blocked' }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
         await prisma.loginLog.create({
            data: { userId: user.id, emailAttempted: email, ipAddress, location, device: userAgent, status: 'FAILED', riskScore: riskScore + 20, riskLevel: (riskScore + 20) >= 70 ? 'CRITICAL' : 'SUSPICIOUS' }
        });
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Success login
    const log = await prisma.loginLog.create({
        data: { userId: user.id, emailAttempted: email, ipAddress, location, device: userAgent, status: 'SUCCESS', riskScore, riskLevel }
    });

    // If critically suspicious, block user preemptively (depending on rules this might just trigger admin review)
    // We'll let admin review instead of immediate block, but we alert.
    if (riskLevel === 'CRITICAL' || riskLevel === 'SUSPICIOUS') {
         await prisma.securityAlert.create({
            data: {
                type: 'SUSPICIOUS_LOGIN',
                description: `Login bem sucedido com alto risco (${riskScore} pts) via ${email}`,
                severity: riskLevel,
                ipAddress
            }
        });
    }

    const accessToken = signJwtAccessToken({ id: user.id, role: user.role });
    const refreshToken = signJwtRefreshToken({ id: user.id });

    return NextResponse.json({
        message: 'Login successful',
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        accessToken,
        refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
