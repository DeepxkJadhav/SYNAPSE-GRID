# SynapseGrid Features Documentation

## 🎯 Overview

SynapseGrid is a next-generation collaborative development environment that combines real-time code editing with AI assistance, multi-language compilation, and comprehensive system management capabilities.

---

## 📝 1. Multi-Language Compiler

### Supported Languages
- **Python** (3.8+)
- **JavaScript** (Node.js 20+)
- **TypeScript** (5.0+)
- **Java** (11+)
- **C++** (C++17)
- **Go** (1.20+)
- **Rust** (1.70+)
- **C#** (.NET 6.0+)

### Features
✅ Real-time code compilation
✅ Safe code execution in isolated environment
✅ Standard input/output support
✅ Execution timeout protection (30 seconds)
✅ Detailed error reporting
✅ Execution time tracking

### API Endpoints

#### Compile Code
```http
POST /api/compiler/compile
Content-Type: application/json

{
  "code": "int main() { printf(\"Hello\"); return 0; }",
  "language": "cpp"
}

Response:
{
  "success": true,
  "output": "Compilation successful",
  "executionTime": 245,
  "language": "cpp"
}
```

#### Execute Code
```http
POST /api/compiler/execute
Content-Type: application/json

{
  "code": "print('Hello, World!')\nprint(input('Enter name: '))",
  "language": "python",
  "input": "Alice"
}

Response:
{
  "success": true,
  "stdout": "Hello, World!\nEnter name: Alice",
  "executionTime": 125,
  "language": "python"
}
```

#### Get Supported Languages
```http
GET /api/compiler/languages

Response:
[
  {
    "name": "Python",
    "value": "python",
    "ext": ".py"
  },
  ...
]
```

### Use Cases
- 📚 **Educational Platforms**: Execute student code safely
- 🧪 **Code Testing**: Run unit tests on-the-fly
- 🎮 **Competitive Programming**: Support multiple languages
- 🔍 **Code Review**: Test code snippets before submission

---

## 🤖 2. Code Assistant Bot (AI-Powered)

### Features
✅ Intelligent code review with issue detection
✅ Automated bug diagnosis and fixes
✅ Context-aware code completion
✅ Code generation from descriptions
✅ Code explanation in plain language
✅ Multi-language support

### API Endpoints

#### Code Review
```http
POST /api/assistant/review
Content-Type: application/json

{
  "code": "function add(a, b) { return a + b; }",
  "language": "javascript"
}

Response:
{
  "issues": ["No parameter validation", "Missing JSDoc"],
  "suggestions": [
    "Add input validation",
    "Add JSDoc documentation",
    "Consider edge cases"
  ],
  "overallScore": 72
}
```

#### Bug Analysis & Fix
```http
POST /api/assistant/debug
Content-Type: application/json

{
  "errorMessage": "TypeError: Cannot read property 'length' of undefined",
  "code": "function getLength(str) { return str.length; }",
  "language": "javascript"
}

Response:
{
  "problem": "String parameter can be undefined",
  "solution": "function getLength(str = '') { return str.length; }",
  "explanation": "Added default parameter to prevent undefined access"
}
```

#### Code Completion
```http
POST /api/assistant/complete
Content-Type: application/json

{
  "code": "async function fetchUser(id) {\n  const response = ",
  "language": "javascript",
  "context": "Using fetch API to get user data"
}

Response:
{
  "suggestion": "await fetch(`/api/users/${id}`);",
  "confidence": 0.92
}
```

#### Code Generation
```http
POST /api/assistant/generate
Content-Type: application/json

{
  "description": "Create a function to validate email addresses",
  "language": "python"
}

Response:
{
  "code": "import re\n\ndef validate_email(email):\n    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'\n    return re.match(pattern, email) is not None",
  "explanation": "Uses regex pattern to validate email format"
}
```

#### Code Explanation
```http
POST /api/assistant/explain
Content-Type: application/json

{
  "code": "const result = array.reduce((acc, val) => acc + val, 0);",
  "language": "javascript"
}

Response:
{
  "explanation": "This code uses the reduce method to sum all elements in an array, starting with an initial value of 0."
}
```

### Configuration
Set your OpenAI API key in `.env`:
```env
OPENAI_API_KEY=sk-your_key_here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_TEMPERATURE=0.7
```

### Use Cases
- 📖 **Learning Tool**: Understand code patterns
- 🐛 **Debugging**: Get help with errors
- ⚡ **Productivity**: Auto-complete code
- 🎓 **Code Review**: Automated best practices
- 💡 **Code Generation**: Scaffold new code

---

## 🖥️ 3. Host Control System

### Features
✅ Real-time CPU, Memory, Disk monitoring
✅ Process management and termination
✅ Port availability checking
✅ Network interface monitoring
✅ Disk health status
✅ Resource usage history (24-hour tracking)
✅ System load monitoring

### API Endpoints

#### Get System Information
```http
GET /api/host/system-info

Response:
{
  "hostname": "developer-machine",
  "uptime": 86400,
  "cpu": {
    "model": "Intel Core i7-10700K",
    "cores": 8,
    "speed": 3.8
  },
  "memory": {
    "total": 16777216000,
    "used": 8388608000,
    "available": 8388608000,
    "percent": 50
  },
  "disk": {
    "total": 1099511627776,
    "used": 549755813888,
    "available": 549755813888,
    "percent": 50
  }
}
```

#### Get Running Processes
```http
GET /api/host/processes

Response:
[
  {
    "pid": 1234,
    "name": "node",
    "cmd": "node src/server.ts",
    "memory": 52428800,
    "cpu": 12.5
  },
  ...
]
```

#### Terminate Process
```http
POST /api/host/processes/1234/kill

Response:
{
  "success": true,
  "message": "Process 1234 killed successfully"
}
```

#### Get CPU Usage
```http
GET /api/host/cpu-usage

Response:
{
  "cpuUsage": 45.3
}
```

#### Get Memory Usage
```http
GET /api/host/memory-usage

Response:
{
  "used": 8388608000,
  "total": 16777216000,
  "percent": 50
}
```

#### Record Resource Usage
```http
POST /api/host/record-usage

Response:
{
  "cpu": 45.3,
  "memory": 50.2,
  "disk": 50.1,
  "timestamp": "2024-05-05T10:30:00Z"
}
```

#### Get Usage History
```http
GET /api/host/usage-history

Response:
[
  {
    "cpu": 45.3,
    "memory": 50.2,
    "disk": 50.1,
    "timestamp": "2024-05-05T10:30:00Z"
  },
  ...
]
```

#### Find Available Ports
```http
GET /api/host/available-ports?start=3000&end=3100

Response:
{
  "availablePorts": [3000, 3001, 3002, ...]
}
```

#### Get Network Information
```http
GET /api/host/network-info

Response:
[
  {
    "iface": "eth0",
    "ip4": "192.168.1.100",
    "mac": "00:1a:2b:3c:4d:5e",
    "speed": 1000
  },
  ...
]
```

#### Get Disk Health
```http
GET /api/host/disk-health

Response:
[
  {
    "device": "/dev/sda",
    "size": 1099511627776,
    "type": "SSD",
    "temperature": 45
  },
  ...
]
```

#### Get System Load
```http
GET /api/host/system-load

Response:
{
  "load1": 2.5,
  "load5": 2.3,
  "load15": 2.1
}
```

### Configuration
Set host control parameters in `.env`:
```env
HOST_CONTROL_PORT_START=3000
HOST_CONTROL_PORT_END=65535
HOST_CONTROL_HISTORY_SIZE=1440
```

### Use Cases
- 📊 **Monitoring Dashboard**: Real-time system stats
- 🔧 **DevOps**: Process and port management
- 📈 **Performance Analysis**: Track resource trends
- 🎯 **Optimization**: Identify bottlenecks
- 🏃 **Load Balancing**: Monitor and manage workloads

---

## 🔌 Integration Examples

### Frontend Integration (React/TypeScript)

```typescript
// Compiler Service
async function executeCode(code: string, language: string) {
  const response = await fetch('/api/compiler/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language })
  });
  return response.json();
}

// Code Assistant
async function reviewCode(code: string, language: string) {
  const response = await fetch('/api/assistant/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language })
  });
  return response.json();
}

// Host Control
async function getSystemInfo() {
  const response = await fetch('/api/host/system-info');
  return response.json();
}
```

### Real-time Updates with Socket.io

```typescript
io.on('connection', (socket) => {
  // Auto-record resource usage every minute
  setInterval(async () => {
    const usage = await hostControlService.recordResourceUsage();
    socket.emit('resource-usage', usage);
  }, 60000);
});
```

---

## 🔒 Security Considerations

1. **Compiler Sandbox**: Code executes in isolated processes with timeout protection
2. **API Authentication**: Compiler, Assistant, and Host Control routes require auth middleware
3. **Rate Limiting**: Implement rate limits to prevent abuse
4. **Resource Limits**: Set execution timeouts and memory limits
5. **OpenAI API**: Use environment variables for API keys, never hardcode

---

## 📚 Additional Resources

- [API Documentation](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Configuration Guide](./CONFIG.md)
- [Troubleshooting](./TROUBLESHOOTING.md)

---

## 🚀 Future Enhancements

- [ ] GPU acceleration for compilation
- [ ] More language support (Ruby, PHP, Scala)
- [ ] Custom runtime environments
- [ ] Collaborative debugging sessions
- [ ] AI-powered performance optimization
- [ ] Container-based sandboxing
- [ ] Real-time code profiling
