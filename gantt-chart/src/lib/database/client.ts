import { CosmosClient } from '@azure/cosmos';

const endpoint = process.env.COSMOS_DB_ENDPOINT as string;
const key = process.env.COSMOS_DB_KEY as string;

if (!endpoint || !key) {
    throw new Error('Cosmos DBの接続情報が環境変数に設定されていません');
}

export const cosmosClient = new CosmosClient({ endpoint, key }); 