"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connection_1 = require("../db/connection");
const auth_1 = require("../middleware/auth");
const shared_1 = require("@synapse/shared");
const crypto_1 = __importDefault(require("crypto"));
const router = (0, express_1.Router)();
// Generate random invite code
const generateInviteCode = () => {
    return crypto_1.default.randomBytes(10).toString('hex').toUpperCase();
};
// ============== CREATE SESSION ==============
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            throw new shared_1.AppError('Session name is required', 400, 'VALIDATION_ERROR');
        }
        const inviteCode = generateInviteCode();
        const result = await (0, connection_1.query)(`INSERT INTO sessions (owner_id, name, description, invite_code)
       VALUES ($1, $2, $3, $4)
       RETURNING id, owner_id, name, description, invite_code, created_at, updated_at, last_activity_at, is_active`, [req.userId, name, description || null, inviteCode]);
        const session = result.rows[0];
        // Add owner as session member
        await (0, connection_1.query)(`INSERT INTO session_users (session_id, user_id, role)
       VALUES ($1, $2, 'owner')`, [session.id, req.userId]);
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
    }
    catch (error) {
        res.status(error instanceof shared_1.AppError ? error.statusCode : 500).json({
            error: {
                message: error instanceof shared_1.AppError ? error.message : 'Failed to create session',
                code: error instanceof shared_1.AppError ? error.code : 'SESSION_CREATE_FAILED',
                statusCode: error instanceof shared_1.AppError ? error.statusCode : 500
            }
        });
    }
});
// ============== JOIN SESSION ==============
router.post('/join', auth_1.authMiddleware, async (req, res) => {
    try {
        const { inviteCode } = req.body;
        if (!inviteCode) {
            throw new shared_1.AppError('Invite code is required', 400, 'VALIDATION_ERROR');
        }
        // Find session by invite code
        const sessionResult = await (0, connection_1.query)(`SELECT id, name, owner_id FROM sessions WHERE invite_code = $1 AND is_active = TRUE`, [inviteCode]);
        if (sessionResult.rows.length === 0) {
            throw new shared_1.AppError('Invalid or inactive session', 404, 'NOT_FOUND');
        }
        const session = sessionResult.rows[0];
        // Check if user is already a member
        const existingMember = await (0, connection_1.query)(`SELECT * FROM session_users WHERE session_id = $1 AND user_id = $2`, [session.id, req.userId]);
        if (existingMember.rows.length > 0) {
            return res.json({
                message: 'User already a member of this session',
                session: { id: session.id, name: session.name }
            });
        }
        // Add user to session
        await (0, connection_1.query)(`INSERT INTO session_users (session_id, user_id, role)
       VALUES ($1, $2, 'editor')`, [session.id, req.userId]);
        // Log audit
        await (0, connection_1.query)(`INSERT INTO audit_logs (session_id, user_id, operation, resource_type, resource_id)
       VALUES ($1, $2, 'join', 'user', $3)`, [session.id, req.userId, req.userId]);
        res.json({
            message: 'Successfully joined session',
            session: { id: session.id, name: session.name }
        });
    }
    catch (error) {
        res.status(error instanceof shared_1.AppError ? error.statusCode : 500).json({
            error: {
                message: error instanceof shared_1.AppError ? error.message : 'Failed to join session',
                code: error instanceof shared_1.AppError ? error.code : 'SESSION_JOIN_FAILED',
                statusCode: error instanceof shared_1.AppError ? error.statusCode : 500
            }
        });
    }
});
// ============== LIST MY SESSIONS ==============
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const result = await (0, connection_1.query)(`SELECT s.id, s.owner_id, s.name, s.description, s.invite_code, 
              s.created_at, s.updated_at, s.last_activity_at, s.is_active,
              su.role, su.joined_at
       FROM sessions s
       JOIN session_users su ON s.id = su.session_id
       WHERE su.user_id = $1 AND s.is_active = TRUE
       ORDER BY s.updated_at DESC`, [req.userId]);
        const sessions = result.rows.map((row) => ({
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
    }
    catch (error) {
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
router.get('/:sessionId', auth_1.authMiddleware, async (req, res) => {
    try {
        const { sessionId } = req.params;
        // Check if user is member of session
        const memberResult = await (0, connection_1.query)(`SELECT su.role FROM session_users su
       WHERE su.session_id = $1 AND su.user_id = $2`, [sessionId, req.userId]);
        if (memberResult.rows.length === 0) {
            throw new shared_1.AppError('Access denied', 403, 'FORBIDDEN');
        }
        // Get session details
        const sessionResult = await (0, connection_1.query)(`SELECT id, owner_id, name, description, invite_code, created_at, updated_at, last_activity_at, is_active
       FROM sessions WHERE id = $1`, [sessionId]);
        if (sessionResult.rows.length === 0) {
            throw new shared_1.AppError('Session not found', 404, 'NOT_FOUND');
        }
        const session = sessionResult.rows[0];
        // Get members
        const membersResult = await (0, connection_1.query)(`SELECT u.id, u.username, u.email, su.role, su.joined_at, su.last_seen_at, su.is_active
       FROM session_users su
       JOIN users u ON su.user_id = u.id
       WHERE su.session_id = $1`, [sessionId]);
        const members = membersResult.rows.map((row) => ({
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
    }
    catch (error) {
        res.status(error instanceof shared_1.AppError ? error.statusCode : 500).json({
            error: {
                message: error instanceof shared_1.AppError ? error.message : 'Failed to fetch session',
                code: error instanceof shared_1.AppError ? error.code : 'SESSION_FETCH_FAILED',
                statusCode: error instanceof shared_1.AppError ? error.statusCode : 500
            }
        });
    }
});
exports.default = router;
//# sourceMappingURL=sessions.js.map