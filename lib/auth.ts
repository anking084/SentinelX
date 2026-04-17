import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sentinelx_super_secret_dev_key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'sentinelx_refresh_dev_key';

export function signJwtAccessToken(payload: any, options: jwt.SignOptions = { expiresIn: '15m' }) {
    return jwt.sign(payload, JWT_SECRET, options);
}

export function signJwtRefreshToken(payload: any, options: jwt.SignOptions = { expiresIn: '7d' }) {
    return jwt.sign(payload, REFRESH_SECRET, options);
}

export function verifyJwt(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error(error);
        return null;
    }
}
