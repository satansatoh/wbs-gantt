// JWTユーティリティ雛形

/**
 * JWTを発行する
 * @param {object} payload - JWTのペイロード
 * @returns {Promise<string>} JWTトークン
 */
export async function signJwt(payload: object): Promise<string> {
    // TODO: JWT発行処理を実装
    return '';
}

/**
 * JWTを検証する
 * @param {string} token - JWTトークン
 * @returns {Promise<object|null>} 検証結果のペイロードまたはnull
 */
export async function verifyJwt(token: string): Promise<object | null> {
    // TODO: JWT検証処理を実装
    return null;
} 