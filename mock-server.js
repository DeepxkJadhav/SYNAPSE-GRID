// Minimal mock server for demo purposes
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock in-memory data
const users = {};
const sessions = {};
const sessionUsers = {};

// Auth endpoints
app.post('/api/auth/register', (req, res) => {
  const { email, username, password } = req.body;
  
  if (users[email]) {
    return res.status(409).json({ error: { message: 'Email already exists' } });
  }
  
  users[email] = { id: `user_${Date.now()}`, email, username, password };
  
  res.status(201).json({
    user: { id: users[email].id, email, username },
    tokens: {
      accessToken: `token_${Date.now()}`,
      refreshToken: `refresh_${Date.now()}`,
      expiresIn: 3600
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!users[email] || users[email].password !== password) {
    return res.status(401).json({ error: { message: 'Invalid credentials' } });
  }
  
  res.json({
    user: { id: users[email].id, email, username: users[email].username },
    tokens: {
      accessToken: `token_${Date.now()}`,
      refreshToken: `refresh_${Date.now()}`,
      expiresIn: 3600
    }
  });
});

// Sessions endpoints
app.post('/api/sessions', (req, res) => {
  const { name } = req.body;
  const sessionId = `session_${Date.now()}`;
  const inviteCode = Math.random().toString(36).substring(7).toUpperCase();
  
  sessions[sessionId] = { id: sessionId, name, inviteCode, createdAt: new Date() };
  
  res.status(201).json({
    session: {
      id: sessionId,
      name,
      inviteCode,
      createdAt: new Date(),
      isActive: true
    }
  });
});

app.get('/api/sessions', (req, res) => {
  res.json({
    sessions: Object.values(sessions).map(s => ({
      ...s,
      role: 'owner',
      joinedAt: new Date()
    }))
  });
});

app.post('/api/sessions/join', (req, res) => {
  const { inviteCode } = req.body;
  const session = Object.values(sessions).find(s => s.inviteCode === inviteCode);
  
  if (!session) {
    return res.status(404).json({ error: { message: 'Session not found' } });
  }
  
  res.json({ message: 'Successfully joined', session });
});

app.get('/api/sessions/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = sessions[sessionId];
  
  if (!session) {
    return res.status(404).json({ error: { message: 'Session not found' } });
  }
  
  res.json({
    session,
    members: [
      { id: 'user1', username: 'alice', role: 'owner', isOnline: true, color: '#FF6B6B' },
      { id: 'user2', username: 'bob', role: 'editor', isOnline: true, color: '#4ECDC4' },
      { id: 'user3', username: 'charlie', role: 'viewer', isOnline: false, color: '#45B7D1' }
    ],
    userRole: 'owner'
  });
});

// Files endpoints
app.get('/api/files/:sessionId', (req, res) => {
  res.json({
    files: [
      { id: 'file1', name: 'index.js', path: '/index.js', type: 'file', size: 1024 },
      { id: 'file2', name: 'styles.css', path: '/styles.css', type: 'file', size: 512 },
      { id: 'file3', name: 'src', path: '/src', type: 'folder', size: 0 },
      { id: 'file4', name: 'App.tsx', path: '/src/App.tsx', type: 'file', size: 2048 }
    ]
  });
});

app.listen(5000, () => {
  console.log('Mock API server running on http://localhost:5000');
});
