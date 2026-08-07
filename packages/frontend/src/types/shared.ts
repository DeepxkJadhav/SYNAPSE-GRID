export type UserRole = 'owner' | 'editor' | 'viewer';

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

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
  color: string;
}
