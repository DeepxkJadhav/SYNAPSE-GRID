# SynapseGrid - Advanced Collaborative Development Environment

**SynapseGrid** is an enterprise-grade, real-time collaborative development platform combining Google Docs-style code editing with VS Code features, AI-powered code assistance, multi-language compilation, and comprehensive host control capabilities.

## 🎯 Core Features

### Phase 1: Foundation ✅
- **User Authentication**: Secure registration, login, JWT-based sessions
- **Session Management**: Create, join, invite collaborators
- **Role-Based Access Control (RBAC)**: Owner, Editor, Viewer roles
- **Multi-Database**: PostgreSQL for persistence + Redis for real-time state

### Phase 2: Real-Time Collaboration 🔄
- **Live Code Editing**: Powered by Yjs + Monaco Editor
- **Presence Tracking**: Real-time cursor tracking and user awareness
- **Multi-User Synchronization**: Conflict-free CRDT-based sync

### Phase 3: Advanced Features 🔄
- **Terminal Sync**: Per-user isolated terminals
- **Code Sandbox**: Docker-based secure code execution
- **Multi-Language Compiler**: Python, JavaScript, TypeScript, Java, C++, Go, Rust, C#
- **AI Code Assistant Bot**: Code review, debugging, generation, completion suggestions
- **Host Control**: System monitoring, process management, resource tracking

## 🚀 New Features

### 📝 Multi-Language Compiler
Compile and execute code in 8+ languages with sandboxed execution:
- Python, JavaScript, TypeScript, Java, C++, Go, Rust, C#
- Real-time compilation feedback
- Code execution with standard input/output
- Timeout protection and error handling

**API Endpoints:**
```
POST /api/compiler/compile    - Compile code
POST /api/compiler/execute    - Execute code
GET  /api/compiler/languages  - List supported languages
```

### 🤖 Code Assistant Bot
AI-powered intelligent code helper using OpenAI integration:
- **Code Review**: Automatic issue detection and suggestions
- **Bug Analysis**: Error diagnosis and fix suggestions
- **Code Generation**: Generate code from descriptions
- **Code Completion**: Smart context-aware suggestions
- **Code Explanation**: Understand complex code segments

**API Endpoints:**
```
POST /api/assistant/review     - Review code for issues
POST /api/assistant/debug      - Analyze and fix bugs
POST /api/assistant/generate   - Generate code from description
POST /api/assistant/complete   - Get code completion suggestions
POST /api/assistant/explain    - Explain code functionality
```

### 🖥️ Host Control System
Comprehensive system monitoring and process management:
- Real-time CPU, Memory, Disk monitoring
- Process monitoring and termination
- Port availability checking
- Network interface information
- Disk health monitoring
- Resource usage history tracking

**API Endpoints:**
```
GET  /api/host/system-info       - System information
GET  /api/host/processes         - Running processes
POST /api/host/processes/:pid/kill - Kill process
GET  /api/host/cpu-usage         - CPU usage
GET  /api/host/memory-usage      - Memory usage
GET  /api/host/usage-history     - Resource history
GET  /api/host/available-ports   - Find available ports
GET  /api/host/network-info      - Network interfaces
GET  /api/host/disk-health       - Disk health
GET  /api/host/system-load       - System load
```

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | Next.js 14 + React 18 + Monaco Editor + Yjs |
| **Backend** | Node.js + Express + Socket.io |
| **Database** | PostgreSQL + Redis |
| **Real-time** | Yjs CRDT + WebSocket |
| **AI** | OpenAI API (GPT-3.5-turbo) |
| **Monitoring** | systeminformation |
| **Containerization** | Docker + Docker Compose |

## 📦 Project Structure

```
synapsegrid/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── compiler.ts      [NEW]
│   │   │   │   ├── assistant.ts     [NEW]
│   │   │   │   └── hostControl.ts   [NEW]
│   │   │   ├── services/
│   │   │   │   ├── compiler.ts      [NEW]
│   │   │   │   ├── codeAssistant.ts [NEW]
│   │   │   │   └── hostControl.ts   [NEW]
│   │   │   ├── middleware/
│   │   │   ├── sockets/
│   │   │   └── db/
│   │   └── Dockerfile
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/        [Enhanced UI]
│   │   │   ├── pages/
│   │   │   └── lib/
│   │   └── Dockerfile
│   └── shared/
│       ├── types.ts               [Updated]
│       └── index.ts
├── docker-compose.yml
├── package.json                    [Updated]
└── README.md                       [This file]
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose (recommended)
- Node.js 20+ (for local development)
- OpenAI API key (for code assistant)

### Option 1: Docker Compose (Recommended)

```bash
# Clone/setup repository
cd synapsegrid

# Copy environment file
cp .env.example .env

# Update .env with:
# - OPENAI_API_KEY=your_api_key_here
# - Database credentials
# - Frontend URL

# Start all services
docker-compose up

# Access:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Database: localhost:5432
# Redis: localhost:6379
```

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Setup database
npm run db:setup

# Environment variables
cp .env.example .env
# Update OPENAI_API_KEY and database settings

# Start backend
npm run dev -w @synapse/backend

# In another terminal, start frontend
npm run dev -w @synapse/frontend

# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

## 🔌 API Examples

### Compiler API
```bash
# Execute Python code
curl -X POST http://localhost:5000/api/compiler/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(\"Hello, SynapseGrid!\")",
    "language": "python"
  }'

# Compile TypeScript
curl -X POST http://localhost:5000/api/compiler/compile \
  -H "Content-Type: application/json" \
  -d '{
    "code": "const x: number = 42;",
    "language": "typescript"
  }'
```

### Assistant API
```bash
# Review code
curl -X POST http://localhost:5000/api/assistant/review \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function add(a, b) { return a + b; }",
    "language": "javascript"
  }'

# Generate code
curl -X POST http://localhost:5000/api/assistant/generate \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Create a function to calculate factorial",
    "language": "python"
  }'
```

### Host Control API
```bash
# Get system info
curl http://localhost:5000/api/host/system-info

# Get processes
curl http://localhost:5000/api/host/processes

# Get CPU usage
curl http://localhost:5000/api/host/cpu-usage

# Find available ports
curl http://localhost:5000/api/host/available-ports?start=3000&end=3100
```

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start PostgreSQL and Redis (Docker)
docker-compose up postgres redis

# In separate terminals:
npm run dev -w @collab/backend  # Starts on :5000
npm run dev -w @collab/frontend # Starts on :3000
```

## Project Structure

```
collab-dev-env/
├── packages/
│   ├── frontend/          # Next.js React app
│   │   ├── src/
│   │   │   ├── pages/     # Next.js pages (login, register, dashboard, editor)
│   │   │   ├── components/# React components (Editor, FileTree, Terminal, Presence)
│   │   │   ├── lib/       # API client, Zustand stores
│   │   │   └── globals.css
│   │   └── Dockerfile
│   ├── backend/           # Node.js Express server
│   │   ├── src/
│   │   │   ├── server.ts
│   │   │   ├── routes/    # auth, sessions, files
│   │   │   ├── services/  # SessionService, FileService, TerminalService
│   │   │   ├── middleware/# auth, errorHandler, rbac
│   │   │   ├── sockets/   # fileEvents, presenceEvents
│   │   │   └── db/        # PostgreSQL schema & connection
│   │   └── Dockerfile
│   └── shared/            # TypeScript types & interfaces
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## API Routes

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### Sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions` - List user's sessions
- `GET /api/sessions/:sessionId` - Get session details
- `POST /api/sessions/join` - Join session by invite code

### Files
- `POST /api/files/:sessionId` - Create file/folder
- `GET /api/files/:sessionId` - List files in session
- `GET /api/files/:sessionId/:fileId` - Get file content

## WebSocket Events

### File Events
- `file:open` - User opens file
- `file:close` - User closes file
- `file:update` - File content changes (Yjs delta)
- `file:delete` - File deleted
- `file:rename` - File renamed
- `file:list-update` - File tree changed

### Presence Events
- `user:join` - User joined session
- `user:leave` - User left session
- `presence:update` - User presence (cursor, active file)
- `cursor:move` - Cursor position changed
- `selection:change` - Text selection changed

## Database Schema

### Tables
- `users` - User accounts
- `sessions` - Collaboration sessions
- `session_users` - Session membership + RBAC
- `files` - File nodes (files and folders)
- `file_revisions` - File version history
- `audit_logs` - Activity log
- `refresh_tokens` - Token management

## Development Workflow

### Phase 1 (Current)
- [x] Project scaffolding
- [x] Auth system (register, login, JWT)
- [x] Session management (create, join, RBAC)
- [x] Database schema
- [x] Backend API routes
- [x] Frontend pages (login, register, dashboard)
- [ ] Tests & verification

### Phase 2 (Next)
- [ ] Yjs + Monaco integration
- [ ] Real-time file sync via WebSocket
- [ ] Presence tracking (cursors, user awareness)
- [ ] File tree with create/delete/rename
- [ ] Conflict resolution testing

### Phase 3
- [ ] Terminal service (per-user PTY)
- [ ] Docker sandbox (per-user container)
- [ ] Terminal WebSocket sync
- [ ] Code execution with timeout

### Phase 4+
- [ ] Persistence & session recovery
- [ ] Horizontal scaling (multi-server)
- [ ] Performance optimization
- [ ] Production deployment

## Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Build for production
npm run build
```

## Environment Variables

See `.env.example` for all available options:
- `BACKEND_PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for access token signing
- `JWT_REFRESH_SECRET` - Secret for refresh token
- `FRONTEND_URL` - Frontend origin (for CORS)

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Database connection error
```bash
# Check if PostgreSQL is running
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up
```

### Redis connection error
```bash
# Check if Redis is running
docker-compose logs redis

# Test connection
redis-cli -p 6379 ping
```

## Contributing

1. Create a branch for your feature
2. Write tests first (TDD approach)
3. Implement feature
4. Submit PR with description

## License

MIT

## Next Steps

After Phase 1 verification:
1. Run `docker-compose up`
2. Create user account at http://localhost:3000
3. Create a session and invite code
4. Join session from another browser tab
5. Verify user management and session persistence

Phase 2 will add real-time file collaboration and presence tracking.
