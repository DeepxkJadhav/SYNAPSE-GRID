"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.io = exports.httpServer = exports.app = void 0;
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Import database
const connection_1 = require("./db/connection");
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const sessions_1 = __importDefault(require("./routes/sessions"));
const files_1 = __importDefault(require("./routes/files"));
const compiler_1 = __importDefault(require("./routes/compiler"));
const assistant_1 = __importDefault(require("./routes/assistant"));
const hostControl_1 = __importDefault(require("./routes/hostControl"));
const primeAgent_1 = __importDefault(require("./routes/primeAgent"));
// Import middleware
const auth_2 = require("./middleware/auth");
const errorHandler_1 = require("./middleware/errorHandler");
// Import socket handlers
const fileEvents_1 = require("./sockets/fileEvents");
const presenceEvents_1 = require("./sockets/presenceEvents");
const app = (0, express_1.default)();
exports.app = app;
const httpServer = (0, http_1.createServer)(app);
exports.httpServer = httpServer;
const PORT = process.env.BACKEND_PORT || 5000;
// ============== MIDDLEWARE ==============
app.use((0, helmet_1.default)());
const isAllowedOrigin = (origin) => {
    if (!origin)
        return true;
    if (origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1') ||
        origin.startsWith('file://')) {
        return true;
    }
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
        return true;
    }
    return false;
};
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        callback(null, isAllowedOrigin(origin));
    },
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ============== SOCKET.IO ==============
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: (origin, callback) => {
            callback(null, isAllowedOrigin(origin));
        },
        credentials: true
    }
});
exports.io = io;
// ============== ROUTES ==============
app.use('/api/auth', auth_1.default);
app.use('/api/sessions', sessions_1.default);
app.use('/api/files', auth_2.authMiddleware, files_1.default);
app.use('/api/compiler', compiler_1.default);
app.use('/api/assistant', assistant_1.default);
app.use('/api/host', hostControl_1.default);
app.use('/api/prime', primeAgent_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// ============== ERROR HANDLER ==============
app.use(errorHandler_1.errorHandler);
// ============== SOCKET.IO SETUP ==============
io.use((socket, next) => {
    // TODO: Implement socket authentication middleware
    next();
});
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    // Setup event handlers
    (0, fileEvents_1.setupFileEvents)(socket, io);
    (0, presenceEvents_1.setupPresenceEvents)(socket, io);
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
// ============== SERVER STARTUP ==============
const startServer = async () => {
    try {
        // Initialize database
        await (0, connection_1.initializeDatabase)();
        console.log('Database initialized');
        // Start HTTP server
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
exports.startServer = startServer;
// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    httpServer.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    httpServer.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
if (process.env.NODE_ENV !== 'test') {
    startServer();
}
//# sourceMappingURL=server.js.map