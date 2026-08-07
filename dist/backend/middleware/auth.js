"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rbacMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const shared_1 = require("@synapse/shared");
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new shared_1.AppError('No token provided', 401, 'UNAUTHORIZED');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default-secret');
        req.userId = decoded.userId;
        req.email = decoded.email;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({
                error: {
                    message: 'Invalid token',
                    code: 'INVALID_TOKEN',
                    statusCode: 401
                }
            });
        }
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
const rbacMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            // TODO: Implement RBAC check based on session and user role
            // For now, just check if user is authenticated
            if (!req.userId) {
                throw new shared_1.AppError('Unauthorized', 401, 'UNAUTHORIZED');
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.rbacMiddleware = rbacMiddleware;
//# sourceMappingURL=auth.js.map