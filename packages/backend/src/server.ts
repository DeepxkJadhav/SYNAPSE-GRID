import 'express-async-errors';
import express, { Request, Response, NextFunction, Express } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import database
import { initializeDatabase } from './db/connection';

// Import routes
import authRoutes from './routes/auth';
import sessionRoutes from './routes/sessions';
import fileRoutes from './routes/files';
import compilerRoutes from './routes/compiler';
import assistantRoutes from './routes/assistant';
import hostControlRoutes from './routes/hostControl';
import primeAgentRoutes from './routes/primeAgent';

// Import middleware
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

// Import socket handlers
import { setupFileEvents } from './sockets/fileEvents';
import { setupPresenceEvents } from './sockets/presenceEvents';

const app: Express = express();
const httpServer = createServer(app);
const PORT = process.env.BACKEND_PORT || 5000;

// ============== MIDDLEWARE ==============
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============== SOCKET.IO ==============
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL
      : 'http://localhost:3000',
    credentials: true
  }
});

// ============== ROUTES ==============
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/files', authMiddleware, fileRoutes);
app.use('/api/compiler', compilerRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/host', hostControlRoutes);
app.use('/api/prime', primeAgentRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// ============== ERROR HANDLER ==============
app.use(errorHandler);

// ============== SOCKET.IO SETUP ==============
io.use((socket, next) => {
  // TODO: Implement socket authentication middleware
  next();
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Setup event handlers
  setupFileEvents(socket, io);
  setupPresenceEvents(socket, io);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// ============== SERVER STARTUP ==============
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('Database initialized');

    // Start HTTP server
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

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

export { app, httpServer, io, startServer };
