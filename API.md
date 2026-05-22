# SynapseGrid API Reference

## Base URL
```
http://localhost:5000/api
```

---

## 📝 Compiler API

### Compile Code
```http
POST /compiler/compile
Content-Type: application/json

{
  "code": "string",
  "language": "python|javascript|typescript|java|cpp|go|rust|csharp"
}
```

**Response (Success)**
```json
{
  "success": true,
  "output": "Compilation output",
  "executionTime": 245,
  "language": "python"
}
```

**Response (Error)**
```json
{
  "success": false,
  "error": "Error message",
  "executionTime": 125,
  "language": "python"
}
```

---

### Execute Code
```http
POST /compiler/execute
Content-Type: application/json

{
  "code": "string",
  "language": "python|javascript|typescript|java|cpp|go|rust|csharp",
  "input": "optional stdin"
}
```

**Response (Success)**
```json
{
  "success": true,
  "stdout": "program output",
  "executionTime": 150,
  "language": "python"
}
```

**Response (Error)**
```json
{
  "success": false,
  "stderr": "error output",
  "executionTime": 125,
  "language": "python"
}
```

---

### Get Supported Languages
```http
GET /compiler/languages
```

**Response**
```json
[
  {
    "name": "Python",
    "value": "python",
    "ext": ".py"
  },
  {
    "name": "JavaScript",
    "value": "javascript",
    "ext": ".js"
  },
  ...
]
```

---

## 🤖 Code Assistant API

### Review Code
```http
POST /assistant/review
Content-Type: application/json

{
  "code": "string",
  "language": "string"
}
```

**Response**
```json
{
  "issues": ["issue 1", "issue 2"],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "overallScore": 75
}
```

---

### Debug Code
```http
POST /assistant/debug
Content-Type: application/json

{
  "errorMessage": "error description",
  "code": "code snippet",
  "language": "string"
}
```

**Response**
```json
{
  "problem": "description of problem",
  "solution": "fixed code",
  "explanation": "why this fixes it"
}
```

---

### Generate Code
```http
POST /assistant/generate
Content-Type: application/json

{
  "description": "what you want to generate",
  "language": "string"
}
```

**Response**
```json
{
  "code": "generated code",
  "explanation": "what the code does"
}
```

---

### Code Completion
```http
POST /assistant/complete
Content-Type: application/json

{
  "code": "partial code",
  "language": "string",
  "context": "optional context"
}
```

**Response**
```json
{
  "suggestion": "completed code",
  "confidence": 0.92
}
```

---

### Explain Code
```http
POST /assistant/explain
Content-Type: application/json

{
  "code": "code to explain",
  "language": "string"
}
```

**Response**
```json
{
  "explanation": "detailed explanation of what the code does"
}
```

---

## 🖥️ Host Control API

### Get System Information
```http
GET /host/system-info
```

**Response**
```json
{
  "hostname": "machine-name",
  "uptime": 86400,
  "cpu": {
    "model": "Intel Core i7",
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

---

### Get Processes
```http
GET /host/processes
```

**Response**
```json
[
  {
    "pid": 1234,
    "name": "node",
    "cmd": "node src/server.ts",
    "memory": 52428800,
    "cpu": 12.5
  }
]
```

---

### Kill Process
```http
POST /host/processes/:pid/kill
```

**Response**
```json
{
  "success": true,
  "message": "Process 1234 killed successfully"
}
```

---

### Get CPU Usage
```http
GET /host/cpu-usage
```

**Response**
```json
{
  "cpuUsage": 45.3
}
```

---

### Get Memory Usage
```http
GET /host/memory-usage
```

**Response**
```json
{
  "used": 8388608000,
  "total": 16777216000,
  "percent": 50
}
```

---

### Record Resource Usage
```http
POST /host/record-usage
```

**Response**
```json
{
  "cpu": 45.3,
  "memory": 50.2,
  "disk": 50.1,
  "timestamp": "2024-05-05T10:30:00Z"
}
```

---

### Get Usage History
```http
GET /host/usage-history
```

**Response**
```json
[
  {
    "cpu": 45.3,
    "memory": 50.2,
    "disk": 50.1,
    "timestamp": "2024-05-05T10:30:00Z"
  }
]
```

---

### Find Available Ports
```http
GET /host/available-ports?start=3000&end=3100
```

**Response**
```json
{
  "availablePorts": [3000, 3001, 3002, 3003, ...]
}
```

---

### Get Network Information
```http
GET /host/network-info
```

**Response**
```json
[
  {
    "iface": "eth0",
    "ip4": "192.168.1.100",
    "mac": "00:1a:2b:3c:4d:5e",
    "speed": 1000
  }
]
```

---

### Get Disk Health
```http
GET /host/disk-health
```

**Response**
```json
[
  {
    "device": "/dev/sda",
    "size": 1099511627776,
    "type": "SSD",
    "temperature": 45
  }
]
```

---

### Get System Load
```http
GET /host/system-load
```

**Response**
```json
{
  "load1": 2.5,
  "load5": 2.3,
  "load15": 2.1
}
```

---

## 🔌 cURL Examples

### Execute Python Code
```bash
curl -X POST http://localhost:5000/api/compiler/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "print(sum([1,2,3,4,5]))",
    "language": "python"
  }'
```

### Review JavaScript Code
```bash
curl -X POST http://localhost:5000/api/assistant/review \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function test(a,b){return a+b}",
    "language": "javascript"
  }'
```

### Generate Python Function
```bash
curl -X POST http://localhost:5000/api/assistant/generate \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Create a function to check if a number is prime",
    "language": "python"
  }'
```

### Get System Information
```bash
curl http://localhost:5000/api/host/system-info
```

### Get Available Ports
```bash
curl "http://localhost:5000/api/host/available-ports?start=8000&end=8100"
```

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (missing/invalid parameters) |
| 404 | Not Found |
| 500 | Server Error |

---

## 🔐 Authentication

Some routes may require authentication. Include JWT token in header:
```bash
Authorization: Bearer <your_jwt_token>
```

---

## 📈 Rate Limiting

Recommended rate limiting (production):
- **Compiler API**: 10 requests/minute per user
- **Assistant API**: 5 requests/minute per user (OpenAI limits)
- **Host Control**: 60 requests/minute per user

---

Generated: May 5, 2026
Last Updated: SynapseGrid v1.0.0
