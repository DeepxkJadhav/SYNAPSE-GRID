"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPresenceEvents = void 0;
const shared_1 = require("@collab/shared");
const setupPresenceEvents = (socket, io) => {
    // ============== USER JOIN ==============
    socket.on(shared_1.SocketEventType.USER_JOIN, (data) => {
        const { sessionId, userId, username, role } = data;
        if (!sessionId) {
            socket.emit(shared_1.SocketEventType.ERROR, { message: 'Session ID required' });
            return;
        }
        // Store session in socket for reference
        socket.sessionId = sessionId;
        socket.userId = userId;
        socket.username = username;
        console.log(`User ${username} (${userId}) joined session ${sessionId}`);
        // Notify others in session
        io.to(`session:${sessionId}`).emit(shared_1.SocketEventType.USER_JOIN, {
            userId,
            username,
            role,
            timestamp: new Date()
        });
    });
    // ============== USER LEAVE ==============
    socket.on(shared_1.SocketEventType.USER_LEAVE, (data) => {
        const { sessionId, userId } = data;
        if (!sessionId) {
            socket.emit(shared_1.SocketEventType.ERROR, { message: 'Session ID required' });
            return;
        }
        console.log(`User ${userId} left session ${sessionId}`);
        // Notify others in session
        io.to(`session:${sessionId}`).emit(shared_1.SocketEventType.USER_LEAVE, {
            userId,
            timestamp: new Date()
        });
        socket.leave(`session:${sessionId}`);
    });
    // ============== PRESENCE UPDATE (cursor position, active file) ==============
    socket.on(shared_1.SocketEventType.PRESENCE_UPDATE, (data) => {
        const { sessionId, userId, username, activeFile, cursorPosition, isOnline, color } = data;
        if (!sessionId) {
            socket.emit(shared_1.SocketEventType.ERROR, { message: 'Session ID required' });
            return;
        }
        // Broadcast presence update to session
        io.to(`session:${sessionId}`).emit(shared_1.SocketEventType.PRESENCE_UPDATE, {
            userId,
            username,
            activeFile,
            cursorPosition,
            isOnline,
            color,
            timestamp: new Date()
        });
    });
    // ============== CURSOR MOVE ==============
    socket.on(shared_1.SocketEventType.CURSOR_MOVE, (data) => {
        const { sessionId, userId, fileId, line, column } = data;
        if (!sessionId) {
            socket.emit(shared_1.SocketEventType.ERROR, { message: 'Session ID required' });
            return;
        }
        // Broadcast cursor position to session (except sender)
        socket.to(`session:${sessionId}`).emit(shared_1.SocketEventType.CURSOR_MOVE, {
            userId,
            fileId,
            line,
            column,
            timestamp: new Date()
        });
    });
    // ============== SELECTION CHANGE ==============
    socket.on(shared_1.SocketEventType.SELECTION_CHANGE, (data) => {
        const { sessionId, userId, fileId, selection } = data;
        if (!sessionId) {
            socket.emit(shared_1.SocketEventType.ERROR, { message: 'Session ID required' });
            return;
        }
        // Broadcast selection to session
        socket.to(`session:${sessionId}`).emit(shared_1.SocketEventType.SELECTION_CHANGE, {
            userId,
            fileId,
            selection,
            timestamp: new Date()
        });
    });
    socket.on('disconnect', () => {
        const sessionId = socket.sessionId;
        const userId = socket.userId;
        const username = socket.username;
        if (sessionId && userId) {
            console.log(`User ${username} (${userId}) disconnected from session ${sessionId}`);
            // Notify others that user is offline
            io.to(`session:${sessionId}`).emit(shared_1.SocketEventType.USER_LEAVE, {
                userId,
                timestamp: new Date()
            });
        }
    });
};
exports.setupPresenceEvents = setupPresenceEvents;
//# sourceMappingURL=presenceEvents.js.map