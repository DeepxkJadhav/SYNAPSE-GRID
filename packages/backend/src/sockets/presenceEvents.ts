import { Socket } from 'socket.io';
import { Server as SocketIOServer } from 'socket.io';
import { SocketEventType } from '@synapse/shared';

export const setupPresenceEvents = (socket: Socket, io: SocketIOServer) => {
  // ============== USER JOIN ==============
  socket.on(SocketEventType.USER_JOIN, (data: any) => {
    const { sessionId, userId, username, role } = data;

    if (!sessionId) {
      socket.emit(SocketEventType.ERROR, { message: 'Session ID required' });
      return;
    }

    // Store session in socket for reference
    (socket as any).sessionId = sessionId;
    (socket as any).userId = userId;
    (socket as any).username = username;

    console.log(`User ${username} (${userId}) joined session ${sessionId}`);

    // Notify others in session
    io.to(`session:${sessionId}`).emit(SocketEventType.USER_JOIN, {
      userId,
      username,
      role,
      timestamp: new Date()
    });
  });

  // ============== USER LEAVE ==============
  socket.on(SocketEventType.USER_LEAVE, (data: any) => {
    const { sessionId, userId } = data;

    if (!sessionId) {
      socket.emit(SocketEventType.ERROR, { message: 'Session ID required' });
      return;
    }

    console.log(`User ${userId} left session ${sessionId}`);

    // Notify others in session
    io.to(`session:${sessionId}`).emit(SocketEventType.USER_LEAVE, {
      userId,
      timestamp: new Date()
    });

    socket.leave(`session:${sessionId}`);
  });

  // ============== PRESENCE UPDATE (cursor position, active file) ==============
  socket.on(SocketEventType.PRESENCE_UPDATE, (data: any) => {
    const { sessionId, userId, username, activeFile, cursorPosition, isOnline, color } = data;

    if (!sessionId) {
      socket.emit(SocketEventType.ERROR, { message: 'Session ID required' });
      return;
    }

    // Broadcast presence update to session
    io.to(`session:${sessionId}`).emit(SocketEventType.PRESENCE_UPDATE, {
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
  socket.on(SocketEventType.CURSOR_MOVE, (data: any) => {
    const { sessionId, userId, fileId, line, column } = data;

    if (!sessionId) {
      socket.emit(SocketEventType.ERROR, { message: 'Session ID required' });
      return;
    }

    // Broadcast cursor position to session (except sender)
    socket.to(`session:${sessionId}`).emit(SocketEventType.CURSOR_MOVE, {
      userId,
      fileId,
      line,
      column,
      timestamp: new Date()
    });
  });

  // ============== SELECTION CHANGE ==============
  socket.on(SocketEventType.SELECTION_CHANGE, (data: any) => {
    const { sessionId, userId, fileId, selection } = data;

    if (!sessionId) {
      socket.emit(SocketEventType.ERROR, { message: 'Session ID required' });
      return;
    }

    // Broadcast selection to session
    socket.to(`session:${sessionId}`).emit(SocketEventType.SELECTION_CHANGE, {
      userId,
      fileId,
      selection,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    const sessionId = (socket as any).sessionId;
    const userId = (socket as any).userId;
    const username = (socket as any).username;

    if (sessionId && userId) {
      console.log(`User ${username} (${userId}) disconnected from session ${sessionId}`);

      // Notify others that user is offline
      io.to(`session:${sessionId}`).emit(SocketEventType.USER_LEAVE, {
        userId,
        timestamp: new Date()
      });
    }
  });
};
