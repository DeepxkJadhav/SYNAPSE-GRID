import { Pool, PoolClient } from 'pg';
declare const pool: Pool;
export declare const initializeDatabase: () => Promise<void>;
export declare const query: (text: string, params?: unknown[]) => Promise<any>;
export declare const getClient: () => Promise<PoolClient>;
export default pool;
//# sourceMappingURL=connection.d.ts.map