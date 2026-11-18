<div align="center">

# ⚡ SynapseGrid
### Next-Gen Cybernetic Workstation, Multi-Language Compiler & Autonomous Prime Agent RLM

[![License: MIT](https://img.shields.io/badge/License-MIT-10B981.svg?style=for-the-badge)](./LICENSE)
[![Electron](https://img.shields.io/badge/Electron-27-47848F.svg?style=for-the-badge&logo=electron&logoColor=white)](https://electronjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000.svg?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Prime Agent](https://img.shields.io/badge/Prime%20Agent-RLM%20Engine-6366F1.svg?style=for-the-badge)](https://github.com/DeepxkJadhav/SYNAPSE-GRID)

<p align="center">
  <b>Autonomous Prime Agent Studio • Native Host Telemetry Radar • Multi-Language Compiler Sandbox • Live Yjs CRDT Mesh</b><br>
  <i>A cybernetic developer workstation combining local offline autonomy with cloud collaboration and recursive AI execution.</i>
</p>

---

![SynapseGrid Command Center](./assets/showcase/hero.png)

---

</div>

## ✦ What is SynapseGrid?

**SynapseGrid** is a cybernetic developer environment engineered for elite autonomous engineering, instantaneous multi-language compilation, and hardware host telemetry.

Powered by a dual-engine architecture:
1. **Local Standalone Desktop Mode (Default)**: Runs 100% offline with zero external dependencies (no Docker or PostgreSQL required). Direct native file system access, hardware metrics, local compiler bridges, and embedded Recursive Language Model (RLM).
2. **Cloud Collaborative Mesh Mode**: Connects to remote teams with **Yjs CRDT** WebSockets, multi-cursor presence, and persistent cluster state.

---

## 🚀 Core Capabilities

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       SYNAPSEGRID                                           │
├──────────────────────┬──────────────────────┬──────────────────────┬────────────────────────┤
│ 🤖 Prime Agent RLM   │ ⚡ Multi-Compiler     │ 🖥️ Host Telemetry     │ 👥 Collaborative Mesh  │
│ • Autonomous Fix     │ • 8+ Languages       │ • Real-time CPU/RAM  │ • Yjs CRDT Sync        │
│ • Python REPL Kernel │ • Millisecond Bench  │ • Task Kill Manager  │ • Multi-Cursor Live    │
│ • Continual Memory   │ • Sandboxed Runner   │ • Port Availability  │ • Offline Persistence  │
│ • Subagent Swarms    │ • Stdout/Stderr Pipe │ • Disk Health Radar  │ • RBAC Permissions     │
└──────────────────────┴──────────────────────┴──────────────────────┴────────────────────────┘
```

### 1. 🤖 Prime Agent Studio & RLM Autonomous Engine
Integrated AI intelligence powered by Recursive Language Model (RLM) architecture and Continual Harness:
- **Autonomous Self-Healing Pipeline**: Detects compiler/runtime stack traces and automatically isolates, patches, and verifies code faults with 1-click apply.
- **Interactive Persistent Python REPL**: Direct execution in a persistent Python virtualenv with cross-turn variable tracking.
- **Continual Harness Memory (`/refine`)**: Persists lessons learned and architectural rules across sessions so the agent compounds knowledge over time.
- **Subagent Swarms (`rlm.spawn`)**: Coordinates parallel subagents for multi-angle refactoring and security analysis.
- **CLI & Embedded Hybrid**: Seamlessly binds to the local `prime-agent` daemon or operates via the integrated high-intelligence fallback engine.

### 2. 🖥️ Native Desktop Electron Workstation
- **Frameless Obsidian Glass UI**: Custom cybernetic titlebar with window drag regions, minimize/maximize/close controls, and live telemetry badges.
- **Direct Local File System Bridge**: Open real directories on your computer (`📁 Open Folder`), scan nested file trees, read and write files with hot-saving (`Ctrl+S`).
- **Host Hardware Radar**: Live meters for CPU load %, RAM utilization, free memory, running process list with direct process termination (`Kill`), and automated port availability scanning.
- **System Tray Integration**: Background tray menu for quick workspace switching, system diagnostics, and daemon status.

### 3. ⚡ Multi-Language Compiler & Execution Sandbox
Compile and run code on-demand with isolated sandbox security:
- **Supported Languages**: `Python`, `TypeScript`, `JavaScript`, `Rust`, `Go`, `C++`, `Java`, `C#`.
- **Instant Execution**: Captures stdout, stderr, execution times in milliseconds, and exit codes.
- **Shortcuts**: `Ctrl+Enter` to compile and run the active file instantly.

### 4. 👥 Real-Time Collaborative Mesh
- **Conflict-Free State**: Powered by **Yjs CRDT** over Socket.io.
- **Session Management**: Instant invite links, role-based access control (`Owner`, `Editor`, `Viewer`).

---

## 🏗️ System Architecture

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT INTERFACES                                       │
│    Frameless Electron Desktop App   •   Next.js 16 Static / SSR Web   •   Native IPC      │
└─────────────────────────────────────────────┬─────────────────────────────────────────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    │                                                   │
             [Desktop Mode]                                       [Web Cloud Mode]
         Native Node.js IPC Bridge                             REST API + Socket.io (Yjs)
                    │                                                   │
                    ▼                                                   ▼
┌───────────────────────────────────────┐   ┌───────────────────────────────────────────────┐
│       SYNAPSE DESKTOP CORE            │   │          SYNAPSEGRID BACKEND ENGINE           │
│ • Local File System (Tree / Watcher)  │   │ • Resilient Dual Store (Postgres / Memory)   │
│ • Host Hardware Radar (si / OS)       │   │ • Multi-Language Compiler Sandbox             │
│ • Direct Process Runner               │   │ • Prime Agent Studio Hub (/api/prime)         │
│ • Prime Agent Daemon IPC Interface    │   │ • Socket.io Presence & Collaboration          │
└───────────────────────────────────────┘   └───────────────────────────────────────────────┘
```

---

## 📦 Getting Started

### Prerequisites
- **Node.js**: v18.0.0+ (Node 20+ or 24+ recommended)
- **npm**: v9.0.0+

### Installation

```bash
# Clone the repository
git clone https://github.com/DeepxkJadhav/SYNAPSE-GRID.git
cd SYNAPSE-GRID

# Install dependencies across all workspaces
npm install
```

### Running Desktop Workstation

```bash
# Run both Backend API and Desktop Electron App
npm run dev:desktop

# Or run Desktop UI directly
npm run electron-dev
```

### Running Web Application

```bash
# Starts both Backend (Port 5000) and Frontend (Port 3000)
npm run dev
```

### Building Desktop Executable

```bash
# Build complete distribution (NSIS Installer, Portable EXE)
npm run dist
```

---

## 🧪 Testing & Verification

SynapseGrid is tested through an automated test suite verifying compilers, host hardware telemetry, Prime Agent RLM services, and API endpoints:

```bash
# Run backend test suite
npm run test

# Run code linting
npm run lint
```

---

## 📄 License

MIT © [Deepak Jadhav](https://github.com/DeepxkJadhav)
