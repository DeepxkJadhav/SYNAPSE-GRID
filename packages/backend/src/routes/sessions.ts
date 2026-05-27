import { Router, Response } from 'express';
import { query } from '../db/connection';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { AppError, Session, SessionUser, CreateSessionRequest, JoinSessionRequest } from '@synapse/shared';
import crypto from 'crypto';

const router = Router();

// Generate random invite code
const generateInviteCode = (): string => {
  return crypto.randomBytes(10).toString('hex').toUpperCase();
};

// ============== CREATE SESSION ==============
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description }: CreateSessionRequest = req.body;

    if (!name) {
      throw new AppError('Session name is required', 400, 'VALIDATION_ERROR');
    }

    const inviteCode = generateInviteCode();

    const result = await query(
      `INSERT INTO sessions (owner_id, name, description, invite_code)
       VALUES ($1, $2, $3, $4)
       RETURNING id, owner_id, name, description, invite_code, created_at, updated_at, last_activity_at, is_active`,
      [req.userId, name, description || null, inviteCode]
    );

    const session = result.rows[0];

    // Add owner as session member
    await query(
      `INSERT INTO session_users (session_id, user_id, role)
       VALUES ($1, $2, 'owner')`,
      [session.id, req.userId]
    );

    res.status(201).json({
      session: {
        id: session.id,
        ownerId: session.owner_id,
        name: session.name,
        description: session.description,
        inviteCode: session.invite_code,
        createdAt: session.created_at,
        updatedAt: session.updated_at,
        lastActivityAt: session.last_activity_at,
        isActive: session.is_active
      }
    });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      error: {
        message: error instanceof AppError ? error.message : 'Failed to create session',
        code: error instanceof AppError ? error.code : 'SESSION_CREATE_FAILED',
        statusCode: error instanceof AppError ? error.statusCode : 500
      }
    });
  }
});

// ============== JOIN SESSION ==============
router.post('/join', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { inviteCode }: JoinSessionRequest = req.body;

    if (!inviteCode) {
      throw new AppError('Invite code is required', 400, 'VALIDATION_ERROR');
    }

    // Find session by invite code
    const sessionResult = await query(
      `SELECT id, name, owner_id FROM sessions WHERE invite_code = $1 AND is_active = TRUE`,
      [inviteCode]
    );

    if (sessionResult.rows.length === 0) {
      throw new AppError('Invalid or inactive session', 404, 'NOT_FOUND');
    }

    const session = sessionResult.rows[0];

    // Check if user is already a member
    const existingMember = await query(
      `SELECT * FROM session_users WHERE session_id = $1 AND user_id = $2`,
      [session.id, req.userId]
    );

    if (existingMember.rows.length > 0) {
      return res.json({
        message: 'User already a member of this session',
        session: { id: session.id, name: session.name }
      });
    }

    // Add user to session
    await query(
      `INSERT INTO session_users (session_id, user_id, role)
       VALUES ($1, $2, 'editor')`,
      [session.id, req.userId]
    );

    // Log audit
    await query(
      `INSERT INTO audit_logs (session_id, user_id, operation, resource_type, resource_id)
       VALUES ($1, $2, 'join', 'user', $3)`,
      [session.id, req.userId, req.userId]
    );

    res.json({
      message: 'Successfully joined session',
      session: { id: session.id, name: session.name }
    });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      error: {
        message: error instanceof AppError ? error.message : 'Failed to join session',
        code: error instanceof AppError ? error.code : 'SESSION_JOIN_FAILED',
        statusCode: error instanceof AppError ? error.statusCode : 500
      }
    });
  }
});

// ============== LIST MY SESSIONS ==============
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT s.id, s.owner_id, s.name, s.description, s.invite_code, 
              s.created_at, s.updated_at, s.last_activity_at, s.is_active,
              su.role, su.joined_at
       FROM sessions s
       JOIN session_users su ON s.id = su.session_id
       WHERE su.user_id = $1 AND s.is_active = TRUE
       ORDER BY s.updated_at DESC`,
      [req.userId]
    );

    const sessions = result.rows.map(row => ({
      id: row.id,
      ownerId: row.owner_id,
      name: row.name,
      description: row.description,
      inviteCode: row.invite_code,
      role: row.role,
      joinedAt: row.joined_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastActivityAt: row.last_activity_at,
      isActive: row.is_active
    }));

    res.json({ sessions });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch sessions',
        code: 'SESSION_FETCH_FAILED',
        statusCode: 500
      }
    });
  }
});

// ============== GET SESSION DETAILS ==============
router.get('/:sessionId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;

    // Check if user is member of session
    const memberResult = await query(
      `SELECT su.role FROM session_users su
       WHERE su.session_id = $1 AND su.user_id = $2`,
      [sessionId, req.userId]
    );

    if (memberResult.rows.length === 0) {
      throw new AppError('Access denied', 403, 'FORBIDDEN');
    }

    // Get session details
    const sessionResult = await query(
      `SELECT id, owner_id, name, description, invite_code, created_at, updated_at, last_activity_at, is_active
       FROM sessions WHERE id = $1`,
      [sessionId]
    );

    if (sessionResult.rows.length === 0) {
      throw new AppError('Session not found', 404, 'NOT_FOUND');
    }

    const session = sessionResult.rows[0];

    // Get members
    const membersResult = await query(
      `SELECT u.id, u.username, u.email, su.role, su.joined_at, su.last_seen_at, su.is_active
       FROM session_users su
       JOIN users u ON su.user_id = u.id
       WHERE su.session_id = $1`,
      [sessionId]
    );

    const members = membersResult.rows.map(row => ({
      id: row.id,
      username: row.username,
      email: row.email,
      role: row.role,
      joinedAt: row.joined_at,
      lastSeenAt: row.last_seen_at,
      isOnline: row.is_active,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
    }));

    res.json({
      session: {
        id: session.id,
        ownerId: session.owner_id,
        name: session.name,
        description: session.description,
        inviteCode: session.invite_code,
        createdAt: session.created_at,
        updatedAt: session.updated_at,
        lastActivityAt: session.last_activity_at,
        isActive: session.is_active
      },
      members,
      userRole: memberResult.rows[0].role
    });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      error: {
        message: error instanceof AppError ? error.message : 'Failed to fetch session',
        code: error instanceof AppError ? error.code : 'SESSION_FETCH_FAILED',
        statusCode: error instanceof AppError ? error.statusCode : 500
      }
    });
  }
});

export default router;
