import { Router, Response } from 'express';
import { query } from '../db/connection';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AppError, User, AuthToken, RegisterRequest, LoginRequest } from '@synapse/shared';

const router = Router();

// ============== REGISTER ==============
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { email, username, password }: RegisterRequest = req.body;

    if (!email || !username || !password) {
      throw new AppError('Missing required fields', 400, 'VALIDATION_ERROR');
    }

    // Check if user exists
    const existingUser = await query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      throw new AppError('Email or username already exists', 409, 'CONFLICT');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username, created_at',
      [email, username, passwordHash]
    );

    const user = result.rows[0];

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRY || '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
    );

    // Store refresh token hash
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshTokenHash, expiresAt]
    );

    const response: AuthToken = {
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
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      error: {
        message: error instanceof AppError ? error.message : 'Registration failed',
        code: error instanceof AppError ? error.code : 'REGISTRATION_FAILED',
        statusCode: error instanceof AppError ? error.statusCode : 500
      }
    });
  }
});

// ============== LOGIN ==============
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      throw new AppError('Missing email or password', 400, 'VALIDATION_ERROR');
    }

    // Find user
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      throw new AppError('Invalid credentials', 401, 'UNAUTHORIZED');
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, 'UNAUTHORIZED');
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRY || '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
    );

    // Store refresh token hash
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshTokenHash, expiresAt]
    );

    // Update last login
    await query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    const response: AuthToken = {
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
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      error: {
        message: error instanceof AppError ? error.message : 'Login failed',
        code: error instanceof AppError ? error.code : 'LOGIN_FAILED',
        statusCode: error instanceof AppError ? error.statusCode : 500
      }
    });
  }
});

// ============== REFRESH TOKEN ==============
router.post('/refresh', async (req: AuthRequest, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Missing refresh token', 400, 'VALIDATION_ERROR');
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'default-refresh-secret'
    ) as any;

    // Check if token is valid in database
    const tokenResult = await query(
      'SELECT * FROM refresh_tokens WHERE user_id = $1 AND NOT revoked AND expires_at > CURRENT_TIMESTAMP',
      [decoded.userId]
    );

    if (tokenResult.rows.length === 0) {
      throw new AppError('Invalid or expired refresh token', 401, 'UNAUTHORIZED');
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRY || '1h' }
    );

    const response: AuthToken = {
      accessToken,
      refreshToken,
      expiresIn: 3600
    };

    res.json({ tokens: response });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      error: {
        message: error instanceof AppError ? error.message : 'Token refresh failed',
        code: error instanceof AppError ? error.code : 'REFRESH_FAILED',
        statusCode: error instanceof AppError ? error.statusCode : 500
      }
    });
  }
});

export default router;
