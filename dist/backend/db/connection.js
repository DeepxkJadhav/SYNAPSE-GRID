"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = exports.query = exports.initializeDatabase = void 0;
const pg_1 = require("pg");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://collab_user:collab_password@localhost:5432/collab_dev',
});
const initializeDatabase = async () => {
    const client = await pool.connect();
    try {
        // Read schema.sql
        const schemaPath = path_1.default.join(__dirname, 'schema.sql');
        const schema = fs_1.default.readFileSync(schemaPath, 'utf8');
        // Execute schema
        await client.query(schema);
        console.log('Database schema initialized');
    }
    catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
    finally {
        client.release();
    }
};
exports.initializeDatabase = initializeDatabase;
const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: result.rowCount });
        return result;
    }
    catch (error) {
        console.error('Database error:', error);
        throw error;
    }
};
exports.query = query;
const getClient = async () => {
    return pool.connect();
};
exports.getClient = getClient;
exports.default = pool;
//# sourceMappingURL=connection.js.map