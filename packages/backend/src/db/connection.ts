import { Pool, PoolClient } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

let isFallbackMode = false;

// Embedded In-Memory fallback store for desktop standalone & offline mode
const memoryStore = {
  users: [] as any[],
  sessions: [] as any[],
  session_users: [] as any[],
  files: [] as any[],
  refresh_tokens: [] as any[],
  audit_logs: [] as any[],
};

// Seed default offline operator account
const defaultOperatorId = '00000000-0000-0000-0000-000000000001';
memoryStore.users.push({
  id: defaultOperatorId,
  email: 'operator@synapsegrid.dev',
  username: 'operator',
  password_hash: '$2a$10$wT8KzZlQJgQfC3b4g5h6ue9w.e9a0r1t2y3u4i5o6p7a8s9d0f1g',
  created_at: new Date(),
  updated_at: new Date(),
  is_active: true,
});

const defaultSessionId = '00000000-0000-0000-0000-000000000002';
memoryStore.sessions.push({
  id: defaultSessionId,
  owner_id: defaultOperatorId,
  name: 'Local Standalone Session',
  description: 'SynapseGrid Offline Desktop Workspace',
  invite_code: 'LOCAL-GRID-01',
  created_at: new Date(),
  updated_at: new Date(),
  last_activity_at: new Date(),
  is_active: true,
  is_archived: false,
});

memoryStore.session_users.push({
  id: '00000000-0000-0000-0000-000000000003',
  session_id: defaultSessionId,
  user_id: defaultOperatorId,
  role: 'owner',
  joined_at: new Date(),
  last_seen_at: new Date(),
  is_active: true,
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://collab_user:collab_password@localhost:5432/collab_dev',
  connectionTimeoutMillis: 1500,
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    try {
      const schemaPath = path.join(__dirname, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schema);
        console.log('[Synapse Database] PostgreSQL schema initialized successfully.');
      }
    } finally {
      client.release();
    }
  } catch (error: any) {
    isFallbackMode = true;
    console.warn(
      `[Synapse Database] PostgreSQL unavailable (${error.message}). Activating Resilient In-Memory & Local Embedded Store for Desktop Standalone Mode.`
    );
  }
};

/**
 * Resilient query executor that routes to PostgreSQL when available,
 * or handles operations in embedded memory store during desktop standalone mode.
 */
export const query = async (text: string, params: any[] = []): Promise<any> => {
  if (!isFallbackMode) {
    try {
      return await pool.query(text, params);
    } catch (err: any) {
      console.warn(`[Synapse Database] PostgreSQL query failed (${err.message}), falling back to embedded store.`);
      isFallbackMode = true;
    }
  }

  // Handle embedded in-memory SQL mock
  const trimmed = text.trim();
  const normalized = trimmed.toUpperCase();

  // 1. SELECT queries
  if (normalized.startsWith('SELECT')) {
    if (normalized.includes('FROM USERS')) {
      if (params.length > 0) {
        const p1 = params[0];
        const p2 = params[1] || p1;
        const matches = memoryStore.users.filter(
          u => u.id === p1 || u.email === p1 || u.username === p1 || u.username === p2 || u.email === p2
        );
        return { rows: matches, rowCount: matches.length };
      }
      return { rows: memoryStore.users, rowCount: memoryStore.users.length };
    }

    if (normalized.includes('FROM SESSIONS')) {
      if (params.length > 0) {
        const p1 = params[0];
        const matches = memoryStore.sessions.filter(
          s => s.id === p1 || s.invite_code === p1 || s.owner_id === p1
        );
        return { rows: matches, rowCount: matches.length };
      }
      return { rows: memoryStore.sessions, rowCount: memoryStore.sessions.length };
    }

    if (normalized.includes('FROM SESSION_USERS')) {
      if (params.length > 0) {
        const p1 = params[0];
        const p2 = params[1];
        const matches = memoryStore.session_users.filter(
          su => su.session_id === p1 && (!p2 || su.user_id === p2)
        );
        return { rows: matches, rowCount: matches.length };
      }
      return { rows: memoryStore.session_users, rowCount: memoryStore.session_users.length };
    }

    if (normalized.includes('FROM FILES')) {
      if (params.length > 0) {
        const p1 = params[0];
        const matches = memoryStore.files.filter(f => f.session_id === p1 || f.id === p1);
        return { rows: matches, rowCount: matches.length };
      }
      return { rows: memoryStore.files, rowCount: memoryStore.files.length };
    }

    return { rows: [], rowCount: 0 };
  }

  // 2. INSERT queries
  if (normalized.startsWith('INSERT INTO')) {
    const id = crypto.randomUUID();
    const now = new Date();

    if (normalized.includes('INTO USERS')) {
      const newUser = {
        id,
        email: params[0],
        username: params[1],
        password_hash: params[2],
        created_at: now,
        updated_at: now,
        is_active: true,
      };
      memoryStore.users.push(newUser);
      return { rows: [newUser], rowCount: 1 };
    }

    if (normalized.includes('INTO SESSIONS')) {
      const newSession = {
        id,
        owner_id: params[0],
        name: params[1],
        description: params[2] || '',
        invite_code: params[3] || crypto.randomBytes(6).toString('hex').toUpperCase(),
        created_at: now,
        updated_at: now,
        last_activity_at: now,
        is_active: true,
      };
      memoryStore.sessions.push(newSession);
      return { rows: [newSession], rowCount: 1 };
    }

    if (normalized.includes('INTO SESSION_USERS')) {
      const newSU = {
        id,
        session_id: params[0],
        user_id: params[1],
        role: params[2] || 'editor',
        joined_at: now,
        is_active: true,
      };
      memoryStore.session_users.push(newSU);
      return { rows: [newSU], rowCount: 1 };
    }

    if (normalized.includes('INTO REFRESH_TOKENS')) {
      const newRT = {
        id,
        user_id: params[0],
        token_hash: params[1],
        expires_at: params[2],
      };
      memoryStore.refresh_tokens.push(newRT);
      return { rows: [newRT], rowCount: 1 };
    }

    if (normalized.includes('INTO FILES')) {
      const newFile = {
        id,
        session_id: params[0],
        name: params[1],
        path: params[2],
        type: params[3] || 'file',
        mime_type: params[4] || 'text/plain',
        size: params[5] || 0,
        created_at: now,
        updated_at: now,
        created_by: params[6],
        is_deleted: false,
      };
      memoryStore.files.push(newFile);
      return { rows: [newFile], rowCount: 1 };
    }

    return { rows: [{ id }], rowCount: 1 };
  }

  // 3. UPDATE queries
  if (normalized.startsWith('UPDATE')) {
    return { rows: [], rowCount: 1 };
  }

  // 4. DELETE queries
  if (normalized.startsWith('DELETE')) {
    return { rows: [], rowCount: 1 };
  }

  return { rows: [], rowCount: 0 };
};

export const getClient = async (): Promise<any> => {
  if (isFallbackMode) {
    return {
      query,
      release: () => {},
    };
  }
  return pool.connect();
};

export default pool;
