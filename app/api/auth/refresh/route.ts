import { NextResponse } from 'next/server';
import { verifyJwt, signJwtAccessToken, signJwtRefreshToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token missing' }, { status: 400 });
    }

    const payload: any = verifyJwt(refreshToken);

    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
    }

    const newAccessToken = signJwtAccessToken({ id: payload.id, role: payload.role });
    const newRefreshToken = signJwtRefreshToken({ id: payload.id });

    return NextResponse.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
