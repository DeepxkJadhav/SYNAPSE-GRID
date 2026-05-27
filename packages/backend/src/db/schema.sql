-- PostgreSQL Database Schema for Collaborative Dev Environment

-- ============== USERS TABLE ==============
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- ============== SESSIONS TABLE ==============
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  invite_code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  is_archived BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_sessions_owner_id ON sessions(owner_id);
CREATE INDEX idx_sessions_invite_code ON sessions(invite_code);
CREATE INDEX idx_sessions_is_active ON sessions(is_active);

-- ============== SESSION USERS (RBAC) TABLE ==============
CREATE TYPE user_role AS ENUM ('owner', 'editor', 'viewer');

CREATE TABLE IF NOT EXISTS session_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'editor',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(session_id, user_id)
);

CREATE INDEX idx_session_users_session_id ON session_users(session_id);
CREATE INDEX idx_session_users_user_id ON session_users(user_id);
CREATE INDEX idx_session_users_role ON session_users(role);

-- ============== FILES TABLE ==============
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  path VARCHAR(1024) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('file', 'folder')),
  mime_type VARCHAR(100),
  size BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  last_modified_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  parent_id UUID REFERENCES files(id) ON DELETE CASCADE
);

CREATE INDEX idx_files_session_id ON files(session_id);
CREATE INDEX idx_files_path ON files(session_id, path);
CREATE INDEX idx_files_parent_id ON files(parent_id);
CREATE INDEX idx_files_is_deleted ON files(is_deleted);

-- ============== FILE REVISIONS (for version history) ==============
CREATE TABLE IF NOT EXISTS file_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  change_description VARCHAR(255),
  revision_number INTEGER NOT NULL
);

CREATE INDEX idx_file_revisions_file_id ON file_revisions(file_id);
CREATE INDEX idx_file_revisions_created_at ON file_revisions(created_at);

-- ============== AUDIT LOG TABLE ==============
CREATE TYPE audit_operation AS ENUM ('create', 'update', 'delete', 'rename', 'join', 'leave', 'role_change');

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  operation audit_operation NOT NULL,
  resource_type VARCHAR(50), -- 'file', 'session', 'user'
  resource_id VARCHAR(255),
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ip_address INET
);

CREATE INDEX idx_audit_logs_session_id ON audit_logs(session_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_operation ON audit_logs(operation);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============== REFRESH TOKENS TABLE ==============
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  revoked BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- ============== TRIGGERS ==============
-- Update updated_at on users table
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- Update updated_at on sessions table
CREATE OR REPLACE FUNCTION update_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sessions_updated_at_trigger
BEFORE UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION update_sessions_updated_at();

-- Update updated_at on files table
CREATE OR REPLACE FUNCTION update_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER files_updated_at_trigger
BEFORE UPDATE ON files
FOR EACH ROW
EXECUTE FUNCTION update_files_updated_at();

-- Auto-update last_activity_at on sessions
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE sessions SET last_activity_at = CURRENT_TIMESTAMP WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_log_session_activity_trigger
AFTER INSERT ON audit_logs
FOR EACH ROW
EXECUTE FUNCTION update_session_activity();
