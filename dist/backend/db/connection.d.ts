import { Pool } from 'pg';
declare const pool: Pool;
export declare const initializeDatabase: () => Promise<void>;
/**
 * Resilient query executor that routes to PostgreSQL when available,
 * or handles operations in embedded memory store during desktop standalone mode.
 */
export declare const query: (text: string, params?: any[]) => Promise<any>;
export declare const getClient: () => Promise<any>;
export default pool;
//# sourceMappingURL=connection.d.ts.map