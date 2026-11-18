import 'express-async-errors';
import { Express } from 'express';
import { Server as SocketIOServer } from 'socket.io';
declare const app: Express;
declare const httpServer: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
declare const io: SocketIOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
declare const startServer: () => Promise<void>;
export { app, httpServer, io, startServer };
//# sourceMappingURL=server.d.ts.map