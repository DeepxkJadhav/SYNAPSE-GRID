// Shared TypeScript types across frontend and backend

// ============== Authentication & Users ==============

export type UserRole = 'owner' | 'editor' | 'viewer';

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

// ============== Sessions ==============

export interface Session {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
  isActive: boolean;
}

export interface SessionUser {
  userId: string;
  sessionId: string;
  role: UserRole;
  joinedAt: Date;
}

export interface SessionMember {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isOnline: boolean;
  activeFile?: string;
  cursorPosition?: { line: number; column: number };
  lastSeenAt: Date;
  color: string; // For presence indicators
}

// ============== Files ==============

export interface FileNode {
  id: string;
  sessionId: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  mimeType?: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  content?: string; // Only populated when reading file
  isDeleted: boolean;
}

export interface FileChange {
  fileId: string;
  userId: string;
  timestamp: Date;
  operation: 'create' | 'update' | 'delete' | 'rename';
  before?: string;
  after?: string;
}

// ============== WebSocket Events ==============

export interface BaseSocketEvent {
  sessionId: string;
  userId: string;
  timestamp: Date;
}

// File events
export interface FileOpenEvent extends BaseSocketEvent {
  fileId: string;
  filePath: string;
}

export interface FileCloseEvent extends BaseSocketEvent {
  fileId: string;
}

export interface FileContentUpdateEvent extends BaseSocketEvent {
  fileId: string;
  delta: unknown; // Yjs update
  version: number;
}

export interface FileDeleteEvent extends BaseSocketEvent {
  fileId: string;
  filePath: string;
}

export interface FileRenameEvent extends BaseSocketEvent {
  fileId: string;
  oldPath: string;
  newPath: string;
}

// Cursor/Presence events
export interface CursorMoveEvent extends BaseSocketEvent {
  fileId: string;
  line: number;
  column: number;
}

export interface PresenceUpdateEvent extends BaseSocketEvent {
  username: string;
  role: UserRole;
  activeFile?: string;
  isOnline: boolean;
}

// Terminal events
export interface TerminalInputEvent extends BaseSocketEvent {
  terminalId: string;
  input: string;
}

export interface TerminalOutputEvent extends BaseSocketEvent {
  terminalId: string;
  output: string;
  type: 'stdout' | 'stderr' | 'exit';
  exitCode?: number;
}

export interface TerminalSpawnEvent extends BaseSocketEvent {
  terminalId: string;
  shell: string;
}

// ============== API Requests/Responses ==============

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface CreateSessionRequest {
  name: string;
  description?: string;
}

export interface JoinSessionRequest {
  inviteCode: string;
}

export interface CreateFileRequest {
  path: string;
  content?: string;
  type: 'file' | 'folder';
}

export interface UpdateFileRequest {
  content: string;
}

export interface SpawnTerminalRequest {
  shell?: string;
}

// ============== Compiler Types ==============

export type SupportedLanguage = 'python' | 'javascript' | 'typescript' | 'java' | 'cpp' | 'go' | 'rust' | 'csharp';

export interface Language {
  name: string;
  value: SupportedLanguage;
  ext: string;
}

export interface CompileRequest {
  code: string;
  language: SupportedLanguage;
  input?: string;
}

export interface CompileResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime: number;
  language: SupportedLanguage;
}

export interface ExecuteResult extends CompileResult {
  stdout?: string;
  stderr?: string;
}

// ============== Code Assistant Types ==============

export interface CodeReview {
  issues: string[];
  suggestions: string[];
  overallScore: number;
}

export interface CodeCompletion {
  suggestion: string;
  confidence: number;
}

export interface BugFix {
  problem: string;
  solution: string;
  explanation: string;
}

export interface GeneratedCode {
  code: string;
  explanation: string;
}

export interface CodeReviewRequest {
  code: string;
  language: string;
}

export interface CodeDebugRequest {
  errorMessage: string;
  code: string;
  language: string;
}

export interface CodeGenerateRequest {
  description: string;
  language: string;
}

export interface CodeCompleteRequest {
  code: string;
  language: string;
  context?: string;
}

export interface CodeExplainRequest {
  code: string;
  language: string;
}

// ============== Host Control Types ==============

export interface SystemInfo {
  hostname: string;
  uptime: number;
  cpu: {
    model: string;
    cores: number;
    speed: number;
  };
  memory: {
    total: number;
    used: number;
    available: number;
    percent: number;
  };
  disk: {
    total: number;
    used: number;
    available: number;
    percent: number;
  };
}

export interface ProcessInfo {
  pid: number;
  name: string;
  cmd: string;
  memory: number;
  cpu: number;
}

export interface ResourceUsage {
  cpu: number;
  memory: number;
  disk: number;
  timestamp: Date;
}

export interface PortStatus {
  port: number;
  status: 'open' | 'closed';
  process?: string;
}

export interface MemoryUsage {
  used: number;
  total: number;
  percent: number;
}

export interface SystemLoad {
  load1: number;
  load5: number;
  load15: number;
}

// ============== Error Types ==============

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
  }
}

export interface ErrorResponse {
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: unknown;
  };
}

// ============== Enums ==============

export enum SocketEventType {
  // Connection
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  
  // User presence
  USER_JOIN = 'user:join',
  USER_LEAVE = 'user:leave',
  PRESENCE_UPDATE = 'presence:update',
  
  // Files
  FILE_OPEN = 'file:open',
  FILE_CLOSE = 'file:close',
  FILE_UPDATE = 'file:update',
  FILE_DELETE = 'file:delete',
  FILE_RENAME = 'file:rename',
  FILE_LIST_UPDATE = 'file:list-update',
  
  // Cursor/Editing
  CURSOR_MOVE = 'cursor:move',
  SELECTION_CHANGE = 'selection:change',
  
  // Terminal
  TERMINAL_SPAWN = 'terminal:spawn',
  TERMINAL_INPUT = 'terminal:input',
  TERMINAL_OUTPUT = 'terminal:output',
  TERMINAL_CLOSE = 'terminal:close',
  
  // Errors
  ERROR = 'error',
}

// ============== Prime Agent & RLM Architecture ==============

export interface PrimeAgentStatus {
  available: boolean;
  version?: string;
  daemonActive: boolean;
  activeAgentsCount: number;
  replKernelReady: boolean;
  kernelVenvPath?: string;
  mode: 'cli' | 'embedded';
}

export interface PrimeAgentSessionInfo {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'stopped' | 'completed';
  createdAt: string;
  lastActivityAt: string;
  tokensUsed?: number;
  goal?: string;
}

export interface PrimeAgentExecuteRequest {
  prompt: string;
  contextCode?: string;
  activeLanguage?: string;
  filePath?: string;
  autonomous?: boolean;
  gateCommand?: string;
  sessionId?: string;
}

export interface PrimeAgentExecuteResult {
  success: boolean;
  output: string;
  suggestedPatch?: string;
  affectedFiles?: string[];
  executionTimeMs: number;
  agentSessionId?: string;
  refinementLessons?: string[];
}

export interface PrimeReplRequest {
  command: string;
  sessionId?: string;
}

export interface PrimeReplResult {
  output: string;
  variables: Record<string, string>;
  error?: string;
  executionTimeMs: number;
}

export interface PrimeSelfHealingRequest {
  code: string;
  language: string;
  errorTrace: string;
  commandExecuted?: string;
}

export interface PrimeSelfHealingResult {
  success: boolean;
  diagnostics: string;
  fixedCode: string;
  explanation: string;
  diffSummary: string;
}

// ============== Desktop Native IPC Types ==============

export interface DesktopFsNode {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  children?: DesktopFsNode[];
}

export interface DesktopHostStats {
  hostname: string;
  platform: string;
  uptimeSeconds: number;
  cpuModel: string;
  cpuCores: number;
  cpuUsagePercent: number;
  ramTotalBytes: number;
  ramUsedBytes: number;
  ramFreeBytes: number;
  ramUsagePercent: number;
  diskUsagePercent: number;
  topProcesses: {
    pid: number;
    name: string;
    cpu: number;
    memory: number;
  }[];
}

