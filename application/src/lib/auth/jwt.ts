import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

/**
 * JWTを発行する
 * @param {string | object | Buffer} payload - JWTのペイロード
 * @returns {Promise<string>} JWTトークン
 */
export async function signJwt(payload: string | object | Buffer): Promise<string> {
    return jwt.sign(payload, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
}

/**
 * JWTを検証する
 * @param {string} token - JWTトークン
 * @returns {Promise<object|null>} 検証結果のペイロードまたはnull
 */
export async function verifyJwt(token: string): Promise<object | null> {
    try {
        return jwt.verify(token, JWT_SECRET) as object;
    } catch {
        return null;
    }
} 