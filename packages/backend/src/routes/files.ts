import { Router, Response } from 'express';
import { query } from '../db/connection';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { AppError } from '@synapse/shared';

const router = Router();

// ============== CREATE FILE/FOLDER ==============
router.post('/:sessionId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { path, type, content } = req.body;

    if (!path || !type) {
      throw new AppError('Path and type are required', 400, 'VALIDATION_ERROR');
    }

    // Check if user has access to session
    const accessResult = await query(
      `SELECT role FROM session_users WHERE session_id = $1 AND user_id = $2`,
      [sessionId, req.userId]
    );

    if (accessResult.rows.length === 0) {
      throw new AppError('Access denied', 403, 'FORBIDDEN');
    }

    const userRole = accessResult.rows[0].role;

    // Only editors and owners can modify files
    if (userRole === 'viewer') {
      throw new AppError('Viewers cannot create files', 403, 'FORBIDDEN');
    }

    // Check if file already exists
    const existingFile = await query(
      `SELECT id FROM files WHERE session_id = $1 AND path = $2 AND is_deleted = FALSE`,
      [sessionId, path]
    );

    if (existingFile.rows.length > 0) {
      throw new AppError('File or folder already exists', 409, 'CONFLICT');
    }

    // Create file
    const mimeType = type === 'file' ? 'text/plain' : null;
    const result = await query(
      `INSERT INTO files (session_id, name, path, type, mime_type, size, created_by, last_modified_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, path, type, mime_type, size, created_at, updated_at, created_by`,
      [sessionId, path.split('/').pop(), path, type, mimeType, content?.length || 0, req.userId, req.userId]
    );

    const file = result.rows[0];

    // Store file content if it's a file type
    if (type === 'file' && content) {
      await query(
        `INSERT INTO file_revisions (file_id, content, created_by, revision_number)
         VALUES ($1, $2, $3, 1)`,
        [file.id, content, req.userId]
      );
    }

    // Log audit
    await query(
      `INSERT INTO audit_logs (session_id, user_id, operation, resource_type, resource_id)
       VALUES ($1, $2, 'create', 'file', $3)`,
      [sessionId, req.userId, file.id]
    );

    res.status(201).json({
      file: {
        id: file.id,
        name: file.name,
        path: file.path,
        type: file.type,
        mimeType: file.mime_type,
        size: file.size,
        createdAt: file.created_at,
        updatedAt: file.updated_at,
        createdBy: file.created_by
      }
    });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      error: {
        message: error instanceof AppError ? error.message : 'Failed to create file',
        code: error instanceof AppError ? error.code : 'FILE_CREATE_FAILED',
        statusCode: error instanceof AppError ? error.statusCode : 500
      }
    });
  }
});

// ============== GET FILE ==============
router.get('/:sessionId/:fileId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, fileId } = req.params;

    // Check access
    const accessResult = await query(
      `SELECT role FROM session_users WHERE session_id = $1 AND user_id = $2`,
      [sessionId, req.userId]
    );

    if (accessResult.rows.length === 0) {
      throw new AppError('Access denied', 403, 'FORBIDDEN');
    }

    // Get file
    const fileResult = await query(
      `SELECT id, name, path, type, mime_type, size, created_at, updated_at FROM files
       WHERE id = $1 AND session_id = $2 AND is_deleted = FALSE`,
      [fileId, sessionId]
    );

    if (fileResult.rows.length === 0) {
      throw new AppError('File not found', 404, 'NOT_FOUND');
    }

    const file = fileResult.rows[0];

    // Get content if it's a file
    let content: string | undefined;
    if (file.type === 'file') {
      const contentResult = await query(
        `SELECT content FROM file_revisions WHERE file_id = $1 ORDER BY revision_number DESC LIMIT 1`,
        [fileId]
      );
      if (contentResult.rows.length > 0) {
        content = contentResult.rows[0].content;
      }
    }

    res.json({
      file: {
        id: file.id,
        name: file.name,
        path: file.path,
        type: file.type,
        mimeType: file.mime_type,
        size: file.size,
        content,
        createdAt: file.created_at,
        updatedAt: file.updated_at
      }
    });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      error: {
        message: error instanceof AppError ? error.message : 'Failed to fetch file',
        code: error instanceof AppError ? error.code : 'FILE_FETCH_FAILED',
        statusCode: error instanceof AppError ? error.statusCode : 500
      }
    });
  }
});

// ============== LIST FILES ==============
router.get('/:sessionId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;

    // Check access
    const accessResult = await query(
      `SELECT role FROM session_users WHERE session_id = $1 AND user_id = $2`,
      [sessionId, req.userId]
    );

    if (accessResult.rows.length === 0) {
      throw new AppError('Access denied', 403, 'FORBIDDEN');
    }

    // Get files
    const filesResult = await query(
      `SELECT id, name, path, type, mime_type, size, created_at, updated_at, created_by, is_deleted
       FROM files
       WHERE session_id = $1 AND is_deleted = FALSE
       ORDER BY path ASC`,
      [sessionId]
    );

    const files = filesResult.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      path: row.path,
      type: row.type,
      mimeType: row.mime_type,
      size: row.size,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by
    }));

    res.json({ files });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      error: {
        message: error instanceof AppError ? error.message : 'Failed to fetch files',
        code: error instanceof AppError ? error.code : 'FILES_FETCH_FAILED',
        statusCode: error instanceof AppError ? error.statusCode : 500
      }
    });
  }
});

export default router;
