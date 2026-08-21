<div align="center">

# ⚡ SynapseGrid
### Enterprise Real-Time Collaborative IDE & Multi-Language Execution Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-10B981.svg?style=for-the-badge)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000.svg?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

<p align="center">
  <b>Live Multi-User CRDT Code Editing • Multi-Language Compiler • AI Assistant Bot • Host Telemetry Control</b><br>
  <i>Combining Google Docs-style collaboration with VS Code power and intelligent operations.</i>
</p>

---

![SynapseGrid Command Center](./assets/showcase/hero.png)

---

</div>

## ✦ What is SynapseGrid?

**SynapseGrid** is an advanced collaborative development environment that merges real-time multi-user code editing with instant multi-language compilation, autonomous AI code assistance, and deep host system monitoring.

Whether debugging complex distributed systems, conducting live technical pair-programming, or executing code across 8+ compiled and interpreted languages, SynapseGrid provides an all-in-one cybernetic workstation.

---

## 🚀 Core Capabilities

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       SYNAPSEGRID                                           │
├──────────────────────┬──────────────────────┬──────────────────────┬────────────────────────┤
│ 👥 Live Collaboration│ ⚡ Multi-Compiler     │ 🤖 AI Assistant      │ 🖥️ Host Telemetry     │
│ • Yjs CRDT Sync      │ • 8+ Languages       │ • Code Review        │ • CPU / RAM Monitoring │
│ • Monaco Editor      │ • Sandboxed Exec     │ • Automated Debugging│ • Process Management   │
│ • Multi-Cursor Live  │ • Real-time Output   │ • Smart Completion   │ • Port Availability    │
│ • RBAC Permissions   │ • Timeout Protection │ • Code Explanation   │ • Disk Health Metrics  │
└──────────────────────┴──────────────────────┴──────────────────────┴────────────────────────┘
```

### 1. 👥 Real-Time Collaborative Editor
- **Conflict-Free Synchronization**: Powered by **Yjs CRDT** over WebSockets.
- **Monaco Code Editor**: Full VS Code editing experience with syntax highlighting, auto-formatting, and multi-cursor presence.
- **Session Management**: Role-based access control (`Owner`, `Editor`, `Viewer`) with one-click invite links.

### 2. 📝 Multi-Language Compiler & Sandbox
Compile and run code on-demand with isolated sandbox security:
- **Supported Languages**: `Python`, `JavaScript`, `TypeScript`, `Java`, `C++`, `Go`, `Rust`, `C#`.
- **Real-Time Terminal Streaming**: Captures standard output (`stdout`), standard error (`stderr`), and execution runtimes.

### 3. 🤖 AI Code Assistant Bot
Integrated AI intelligence for rapid development workflows:
- **Code Review**: Automatically detects security vulnerabilities, memory leaks, and anti-patterns.
- **Automated Debugging**: Diagnoses stack traces and suggests drop-in code fixes.
- **Code Generation & Completion**: Context-aware snippet generator from natural language prompts.
- **Deep Explanations**: Breaks down complex algorithms and architecture diagrams.

### 4. 🖥️ Host Control & Telemetry System
- **Real-Time Metrics**: Live tracking of CPU loads, memory utilization, network throughput, and disk health.
- **Process Manager**: Inspect running system processes with permission-gated process termination (`kill`).
- **Network Diagnostic**: Automated port availability scanning and network interface analysis.

---

## 🏗️ System Architecture

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT INTERFACES                                │
│       Next.js 14 Web App  •  Electron Desktop App  •  Stand-alone Demo        │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │
                         WebSocket (Yjs) / REST API
                                       │
                                       ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                         SYNAPSEGRID BACKEND ENGINE                            │
│  ┌────────────────────────┐  ┌────────────────────────┐  ┌─────────────────┐  │
│  │   EXPRESS REST API     │  │   SOCKET.IO / YJS      │  │  SYSTEM MONITOR │  │
│  │   Auth, Compiler, AI   │  │   Multi-Cursor Sync    │  │  Host Telemetry │  │
│  └───────────┬────────────┘  └───────────┬────────────┘  └────────┬────────┘  │
└──────────────┼───────────────────────────┼────────────────────────┼───────────┘
               │                           │                        │
               ▼                           ▼                        ▼
┌───────────────────────────┐  ┌────────────────────────┐  ┌────────────────────┐
│      DATABASE LAYER       │  │   SANDBOX COMPILER     │  │  AI ASSISTANT HUB  │
│  PostgreSQL (Persistence) │  │   Docker / Subprocess  │  │  OpenAI / Gemini / │
│  Redis (Real-time State)  │  │   8+ Language Runtimes │  │  Local LLM Routers │
└───────────────────────────┘  └────────────────────────┘  └────────────────────┘
```

---

## 🗂️ Project Structure

```text
SYNAPSE-GRID/
├── packages/
│   ├── backend/               # Express + Socket.io + Compiler + AI Hub
│   │   ├── src/
│   │   │   ├── routes/        # Compiler, Assistant, Host Control, Auth routes
│   │   │   ├── services/      # Compiler execution & AI integration services
│   │   │   ├── sockets/       # WebSocket synchronization handlers
│   │   │   └── server.ts      # Server entry point
│   │   └── package.json
│   │
│   ├── frontend/              # Next.js 14 + Tailwind CSS + Monaco Editor UI
│   │   ├── src/
│   │   │   ├── pages/         # Dashboard, workspace, and editor views
│   │   │   ├── lib/           # Yjs provider & socket client
│   │   │   └── types/
│   │   └── package.json
│   │
│   └── shared/                # Shared TypeScript contracts & schemas
│       ├── types.ts
│       └── package.json
│
├── src/main/                  # Electron Desktop Shell wrapper
│   ├── main.ts
│   └── preload.ts
│
├── assets/showcase/           # High-resolution showcase media
│   └── hero.png
│
├── demo.html                  # Standalone interactive browser showcase
├── mock-server.js             # Lightweight standalone testing backend
├── docker-compose.yml         # Containerized PostgreSQL, Redis, Backend, Frontend
├── package.json               # Monorepo root workspace configuration
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** 18.0+ & **npm**
- **Docker & Docker Compose** (optional, for full containerized stack)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/DeepxkJadhav/SYNAPSE-GRID.git
cd SYNAPSE-GRID

# Install monorepo dependencies
npm install
```

### 3. Environment Configuration

```bash
cp .env.example .env
```

```ini
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/synapsegrid
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Running with Docker Compose (Recommended)

```bash
docker compose up -d
```
- **Web Interface**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

### 5. Running in Development Mode

```bash
# Start backend and frontend simultaneously
npm run dev
```

### 6. Interactive Standalone Demo

To test the collaborative interface immediately without external databases:
```bash
node mock-server.js
```
Open `demo.html` in your browser.

---

## 📡 API Reference Overview

### Compiler Engine
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/compiler/compile` | Compiles source code across 8 languages |
| `POST` | `/api/compiler/execute` | Executes binary/script with timeout guards |
| `GET` | `/api/compiler/languages` | Lists available compilers & execution environments |

### AI Assistant Bot
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/assistant/review` | Analyzes code for quality, performance, and security |
| `POST` | `/api/assistant/debug` | Diagnoses runtime bugs & provides fixed snippets |
| `POST` | `/api/assistant/generate` | Generates full functions from natural language prompts |
| `POST` | `/api/assistant/explain` | Explains logic and algorithmic complexity |

### Host Telemetry & Control
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/host/system-info` | Hardware, OS, and platform metrics |
| `GET` | `/api/host/cpu-usage` | Real-time multi-core CPU utilization |
| `GET` | `/api/host/memory-usage` | Active, allocated, and free RAM |
| `GET` | `/api/host/processes` | List active processes and PIDs |
| `POST` | `/api/host/processes/:pid/kill` | Terminate process with permission validation |

---

## 👤 Author

**Deepak Jadhav**
- GitHub: [@DeepxkJadhav](https://github.com/DeepxkJadhav)
- Repository: [SYNAPSE-GRID](https://github.com/DeepxkJadhav/SYNAPSE-GRID)

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE) — Copyright (c) 2026 **Deepak Jadhav**.
