"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connection_1 = require("../db/connection");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const shared_1 = require("@collab/shared");
const router = (0, express_1.Router)();
// ============== REGISTER ==============
router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            throw new shared_1.AppError('Missing required fields', 400, 'VALIDATION_ERROR');
        }
        // Check if user exists
        const existingUser = await (0, connection_1.query)('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
        if (existingUser.rows.length > 0) {
            throw new shared_1.AppError('Email or username already exists', 409, 'CONFLICT');
        }
        // Hash password
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        // Create user
        const result = await (0, connection_1.query)('INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username, created_at', [email, username, passwordHash]);
        const user = result.rows[0];
        // Generate tokens
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'default-secret', { expiresIn: process.env.JWT_EXPIRY || '1h' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_REFRESH_SECRET || 'default-refresh-secret', { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' });
        // Store refresh token hash
        const refreshTokenHash = await bcryptjs_1.default.hash(refreshToken, 10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
        await (0, connection_1.query)('INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)', [user.id, refreshTokenHash, expiresAt]);
        const response = {
            accessToken,
            refreshToken,
            expiresIn: 3600 // 1 hour in seconds
        };
        res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            },
            tokens: response
        });
    }
    catch (error) {
        res.status(error instanceof shared_1.AppError ? error.statusCode : 500).json({
            error: {
                message: error instanceof shared_1.AppError ? error.message : 'Registration failed',
                code: error instanceof shared_1.AppError ? error.code : 'REGISTRATION_FAILED',
                statusCode: error instanceof shared_1.AppError ? error.statusCode : 500
            }
        });
    }
});
// ============== LOGIN ==============
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new shared_1.AppError('Missing email or password', 400, 'VALIDATION_ERROR');
        }
        // Find user
        const result = await (0, connection_1.query)('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            throw new shared_1.AppError('Invalid credentials', 401, 'UNAUTHORIZED');
        }
        const user = result.rows[0];
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new shared_1.AppError('Invalid credentials', 401, 'UNAUTHORIZED');
        }
        // Generate tokens
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'default-secret', { expiresIn: process.env.JWT_EXPIRY || '1h' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_REFRESH_SECRET || 'default-refresh-secret', { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' });
        // Store refresh token hash
        const refreshTokenHash = await bcryptjs_1.default.hash(refreshToken, 10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await (0, connection_1.query)('INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)', [user.id, refreshTokenHash, expiresAt]);
        // Update last login
        await (0, connection_1.query)('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
        const response = {
            accessToken,
            refreshToken,
            expiresIn: 3600
        };
        res.json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            },
            tokens: response
        });
    }
    catch (error) {
        res.status(error instanceof shared_1.AppError ? error.statusCode : 500).json({
            error: {
                message: error instanceof shared_1.AppError ? error.message : 'Login failed',
                code: error instanceof shared_1.AppError ? error.code : 'LOGIN_FAILED',
                statusCode: error instanceof shared_1.AppError ? error.statusCode : 500
            }
        });
    }
});
// ============== REFRESH TOKEN ==============
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new shared_1.AppError('Missing refresh token', 400, 'VALIDATION_ERROR');
        }
        // Verify refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'default-refresh-secret');
        // Check if token is valid in database
        const tokenResult = await (0, connection_1.query)('SELECT * FROM refresh_tokens WHERE user_id = $1 AND NOT revoked AND expires_at > CURRENT_TIMESTAMP', [decoded.userId]);
        if (tokenResult.rows.length === 0) {
            throw new shared_1.AppError('Invalid or expired refresh token', 401, 'UNAUTHORIZED');
        }
        // Generate new access token
        const accessToken = jsonwebtoken_1.default.sign({ userId: decoded.userId, email: decoded.email }, process.env.JWT_SECRET || 'default-secret', { expiresIn: process.env.JWT_EXPIRY || '1h' });
        const response = {
            accessToken,
            refreshToken,
            expiresIn: 3600
        };
        res.json({ tokens: response });
    }
    catch (error) {
        res.status(error instanceof shared_1.AppError ? error.statusCode : 500).json({
            error: {
                message: error instanceof shared_1.AppError ? error.message : 'Token refresh failed',
                code: error instanceof shared_1.AppError ? error.code : 'REFRESH_FAILED',
                statusCode: error instanceof shared_1.AppError ? error.statusCode : 500
            }
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map