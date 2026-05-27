import { Socket } from 'socket.io';
import { Server as SocketIOServer } from 'socket.io';
import { SocketEventType } from '@synapse/shared';

export const setupFileEvents = (socket: Socket, io: SocketIOServer) => {
  // ============== FILE OPEN ==============
  socket.on(SocketEventType.FILE_OPEN, (data: any) => {
    const { sessionId, fileId, filePath, userId } = data;

    if (!sessionId) {
      socket.emit(SocketEventType.ERROR, { message: 'Session ID required' });
      return;
    }

    // Join room for this session
    socket.join(`session:${sessionId}`);

    console.log(`User ${userId} opened file ${fileId} in session ${sessionId}`);

    // Notify others in session
    io.to(`session:${sessionId}`).emit(SocketEventType.FILE_OPEN, {
      fileId,
      filePath,
      userId,
      timestamp: new Date()
    });
  });

  // ============== FILE CLOSE ==============
  socket.on(SocketEventType.FILE_CLOSE, (data: any) => {
    const { sessionId, fileId, userId } = data;

    if (!sessionId) {
      socket.emit(SocketEventType.ERROR, { message: 'Session ID required' });
      return;
    }

    console.log(`User ${userId} closed file ${fileId} in session ${sessionId}`);

    // Notify others in session
    io.to(`session:${sessionId}`).emit(SocketEventType.FILE_CLOSE, {
      fileId,
      userId,
      timestamp: new Date()
    });
  });

  // ============== FILE CONTENT UPDATE (Yjs updates) ==============
  socket.on(SocketEventType.FILE_UPDATE, (data: any) => {
    const { sessionId, fileId, delta, version, userId } = data;

    if (!sessionId) {
      socket.emit(SocketEventType.ERROR, { message: 'Session ID required' });
      return;
    }

    console.log(`File ${fileId} updated in session ${sessionId}`);

    // Broadcast delta to all users in session except sender
    socket.to(`session:${sessionId}`).emit(SocketEventType.FILE_UPDATE, {
      fileId,
      delta,
      version,
      userId,
      timestamp: new Date()
    });
  });

  // ============== FILE DELETE ==============
  socket.on(SocketEventType.FILE_DELETE, (data: any) => {
    const { sessionId, fileId, filePath, userId } = data;

    if (!sessionId) {
      socket.emit(SocketEventType.ERROR, { message: 'Session ID required' });
      return;
    }

    console.log(`File ${fileId} deleted from session ${sessionId}`);

    // Broadcast deletion
    io.to(`session:${sessionId}`).emit(SocketEventType.FILE_DELETE, {
      fileId,
      filePath,
      userId,
      timestamp: new Date()
    });
  });

  // ============== FILE RENAME ==============
  socket.on(SocketEventType.FILE_DELETE, (data: any) => {
    const { sessionId, fileId, oldPath, newPath, userId } = data;

    if (!sessionId) {
      socket.emit(SocketEventType.ERROR, { message: 'Session ID required' });
      return;
    }

    console.log(`File ${fileId} renamed in session ${sessionId}`);

    // Broadcast rename
    io.to(`session:${sessionId}`).emit(SocketEventType.FILE_RENAME, {
      fileId,
      oldPath,
      newPath,
      userId,
      timestamp: new Date()
    });
  });

  // ============== FILE LIST UPDATE ==============
  socket.on(SocketEventType.FILE_LIST_UPDATE, (data: any) => {
    const { sessionId, files, userId } = data;

    if (!sessionId) {
      socket.emit(SocketEventType.ERROR, { message: 'Session ID required' });
      return;
    }

    console.log(`File list updated in session ${sessionId}`);

    // Broadcast file list update
    io.to(`session:${sessionId}`).emit(SocketEventType.FILE_LIST_UPDATE, {
      files,
      userId,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
};
