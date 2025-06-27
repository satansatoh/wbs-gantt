import bcrypt from 'bcryptjs';

// パスワードハッシュ化ユーティリティ雛形

/**
 * パスワードをハッシュ化する
 * @param {string} password - 平文パスワード
 * @returns {Promise<string>} ハッシュ値
 */
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

/**
 * パスワードとハッシュ値を検証する
 * @param {string} password - 平文パスワード
 * @param {string} hash - ハッシュ値
 * @returns {Promise<boolean>} 検証結果
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
} 