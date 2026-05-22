# Contributing to SynapseGrid

Thank you for your interest in contributing to SynapseGrid! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please read and adhere to our Code of Conduct:

- **Be respectful** - Treat all community members with respect
- **Be inclusive** - Welcome people of all backgrounds and experience levels
- **Be collaborative** - Work together to build something great
- **Be constructive** - Provide helpful feedback and suggestions
- **Report issues** - Contact maintainers about code of conduct violations

### Unacceptable Behavior

- Harassment, intimidation, or discrimination
- Offensive comments or unwelcoming language
- Personal attacks or trolling
- Publishing private information without consent
- Any other conduct that violates these principles

---

## Getting Started

### 1. Fork the Repository

```bash
# Visit GitHub and click "Fork"
# https://github.com/DeepxkJadhav/SYNAPSE-GRID

# Clone your fork
git clone https://github.com/YOUR_USERNAME/SYNAPSE-GRID.git
cd SYNAPSE-GRID
```

### 2. Add Upstream Remote

```bash
# Add upstream repository
git remote add upstream https://github.com/DeepxkJadhav/SYNAPSE-GRID.git

# Verify remotes
git remote -v
# origin     → your fork
# upstream   → original repo
```

### 3. Create Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

---

## Development Setup

### Prerequisites

- Node.js 20+
- npm 10+
- Git
- Visual Studio Code (recommended)

### Installation

```bash
# Install dependencies
npm ci

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Build all packages
npm run build

# Start development server
npm run dev
```

### Project Structure

```
synapsegrid/
├── packages/
│   ├── backend/         # Node.js + Express backend
│   ├── frontend/        # Next.js + React frontend
│   └── shared/          # Shared TypeScript types
├── src/
│   └── main/            # Electron main process
├── .github/
│   └── workflows/       # GitHub Actions CI/CD
├── scripts/             # Build and deployment scripts
└── docs/                # Documentation
```

---

## Making Changes

### Code Organization

#### Backend (`packages/backend/`)
```
src/
├── routes/      # Express route handlers
├── services/    # Business logic
├── middleware/  # Express middleware
├── sockets/     # Socket.io handlers
├── db/          # Database setup
└── server.ts    # Entry point
```

#### Frontend (`packages/frontend/`)
```
src/
├── pages/       # Next.js pages
├── components/  # React components
├── lib/         # Utilities and hooks
├── styles/      # CSS/Tailwind styles
└── _app.tsx     # App wrapper
```

### Type Safety

- Always use TypeScript
- Define types in `packages/shared/types.ts`
- Avoid `any` type unless absolutely necessary
- Use strict mode: `"strict": true` in tsconfig.json

### Example: Adding a New Feature

```typescript
// 1. Define types in shared/types.ts
export interface MyFeature {
  id: string;
  name: string;
}

// 2. Create backend service (packages/backend/src/services/myFeature.ts)
export class MyFeatureService {
  async getFeature(id: string): Promise<MyFeature> {
    // Implementation
  }
}

// 3. Create backend route (packages/backend/src/routes/myFeature.ts)
router.get('/features/:id', async (req, res) => {
  const feature = await myFeatureService.getFeature(req.params.id);
  res.json(feature);
});

// 4. Create frontend component (packages/frontend/src/components/MyFeature.tsx)
export function MyFeature() {
  const [feature, setFeature] = useState<MyFeature | null>(null);
  
  useEffect(() => {
    fetchFeature();
  }, []);

  return <div>{feature?.name}</div>;
}
```

---

## Submitting Changes

### Before You Submit

1. **Update your branch**
```bash
git fetch upstream
git rebase upstream/main
```

2. **Run tests**
```bash
npm run test
npm run lint
```

3. **Build locally**
```bash
npm run build
```

4. **Test your changes**
```bash
npm run dev
# Test in browser: http://localhost:3000
```

### Create Pull Request

1. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

2. **Create PR on GitHub**
   - Go to your fork on GitHub
   - Click "Compare & pull request"
   - Write descriptive title and description
   - Link related issues
   - Follow PR template

3. **Respond to reviews**
   - Be receptive to feedback
   - Make requested changes
   - Push updates (no force push)
   - Re-request review after changes

---

## Coding Standards

### TypeScript

```typescript
// ✅ Good
interface UserData {
  id: string;
  email: string;
  name: string;
}

async function getUser(id: string): Promise<UserData> {
  // Implementation with proper error handling
  try {
    const user = await db.query(id);
    return user;
  } catch (error) {
    throw new Error(`Failed to get user: ${error}`);
  }
}

// ❌ Avoid
function getUser(id: any): any {
  // Missing types, error handling, etc.
}
```

### React Components

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded bg-blue-500 text-white"
    >
      {label}
    </button>
  );
}

// ❌ Avoid
function Button(props) {
  return <button {...props}>{props.label}</button>;
}
```

### Comments & Documentation

```typescript
/**
 * Compiles code in the specified language
 * @param code - The code to compile
 * @param language - Programming language
 * @returns CompileResult with output or error
 * @throws Error if language is unsupported
 * @example
 * const result = await compile("print('hello')", "python");
 */
async function compile(code: string, language: SupportedLanguage): Promise<CompileResult> {
  // Implementation
}
```

### Naming Conventions

- **Classes**: PascalCase (CompilerService)
- **Functions**: camelCase (compileCode)
- **Constants**: UPPER_SNAKE_CASE (MAX_TIMEOUT)
- **Interfaces**: PascalCase with I prefix (IUserData)
- **Files**: kebab-case (compiler.service.ts)

---

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run specific test
npm run test -- compiler.test.ts

# Run with coverage
npm run test -- --coverage
```

### Writing Tests

```typescript
// Example test file: packages/backend/src/services/compiler.test.ts
import { compilerService } from './compiler';

describe('CompilerService', () => {
  it('should execute Python code', async () => {
    const result = await compilerService.execute('print("test")', 'python');
    expect(result.success).toBe(true);
    expect(result.stdout).toContain('test');
  });

  it('should handle compilation errors', async () => {
    const result = await compilerService.execute('invalid syntax', 'python');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

### Test Coverage Requirements

- Aim for **80%+ coverage** on business logic
- Focus on edge cases and error scenarios
- Mock external dependencies (APIs, databases)
- Use descriptive test names

---

## Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Examples

```
feat(compiler): add Rust language support

Added support for compiling and executing Rust code.
Includes error handling and timeout protection.

Fixes #123
```

```
fix(assistant): improve error message clarity

Changed error messages to be more helpful for debugging.

Relates to #456
```

### Types

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style (formatting, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding/updating tests
- `chore:` Build process, dependencies

### Scopes

- `compiler` - Compiler service
- `assistant` - Code assistant
- `host` - Host control system
- `backend` - Backend API
- `frontend` - Frontend UI
- `types` - Shared types

---

## Pull Requests

### PR Title Format

```
[Type] Brief description

Examples:
[Feature] Add support for Rust compilation
[Fix] Resolve database connection timeout
[Docs] Update API documentation
[Refactor] Improve error handling
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Motivation
Why are these changes needed?

## Testing
How can reviewers test this?

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Follows code standards
- [ ] Ready for review
```

### Review Process

1. **Automated Checks**
   - Tests pass
   - Linting passes
   - No merge conflicts

2. **Code Review**
   - At least 1 maintainer approval
   - All feedback addressed
   - Changes look good

3. **Merge**
   - Squash commits (optional)
   - Delete branch
   - Close related issues

---

## Common Contributions

### 🐛 Bug Reports

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Do this
2. Then that
3. Bug occurs

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: Windows 10
- Node: 20.x
- npm: 10.x
```

### ✨ Feature Requests

```markdown
## Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Example Usage
How would users interact with this?

## Implementation Ideas
Suggestions for implementation (optional)
```

### 📚 Documentation

- Fix typos and clarity
- Add missing documentation
- Improve examples
- Add new guides

### 🎨 Design Improvements

- UI/UX enhancements
- Accessibility improvements
- Performance optimizations
- Code refactoring

---

## Questions or Issues?

- 📧 Email: team@synapsegrid.dev
- 💬 [GitHub Discussions](https://github.com/DeepxkJadhav/SYNAPSE-GRID/discussions)
- 🐛 [GitHub Issues](https://github.com/DeepxkJadhav/SYNAPSE-GRID/issues)
- 📖 [Documentation](https://github.com/DeepxkJadhav/SYNAPSE-GRID/blob/main/README.md)

---

## 🙏 Thank You!

Thank you for contributing to SynapseGrid! Your efforts help make this project better for everyone.

---

**Happy Contributing! 🚀**
