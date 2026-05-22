"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const shared_1 = require("@collab/shared");
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof shared_1.AppError) {
        return res.status(err.statusCode).json({
            error: {
                message: err.message,
                code: err.code,
                statusCode: err.statusCode
            }
        });
    }
    res.status(500).json({
        error: {
            message: 'Internal server error',
            code: 'INTERNAL_ERROR',
            statusCode: 500
        }
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map