# SynapseGrid Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Building Windows Executables](#building-windows-executables)
3. [GitHub Setup](#github-setup)
4. [Creating Releases](#creating-releases)
5. [Deploying to Production](#deploying-to-production)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Local Development
- **Node.js 20+** - Download from [nodejs.org](https://nodejs.org/)
- **npm 10+** - Comes with Node.js
- **Git** - Download from [git-scm.com](https://git-scm.com/)
- **Visual Studio Build Tools** (Windows) - For native module compilation

### For GitHub Releases
- **GitHub Account** with repository access
- **Personal Access Token** (PAT) for GitHub Actions

### For Windows Installation
- **Windows 10 or 11**
- **Administrator privileges** for installation
- **.NET Framework 4.5+** (for C# support)

---

## Building Windows Executables

### Option 1: Using Build Script (Recommended)

#### On Windows (Command Prompt)
```bash
cd "C:\SYNAPSE GRID"
build.bat
```

#### On Windows (PowerShell)
```powershell
cd "C:\SYNAPSE GRID"
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\build.ps1
```

#### On macOS/Linux
```bash
cd /path/to/SYNAPSE\ GRID
chmod +x build.sh
./build.sh
```

### Option 2: Manual Build Process

```bash
# Navigate to project
cd "C:\SYNAPSE GRID"

# Install dependencies
npm ci

# Build backend
npm run build -w @synapse/backend

# Build frontend
npm run build -w @synapse/frontend

# Create Windows executables (NSIS, MSI, Portable)
npm run dist
```

### Output Files
After building, you'll find in the `dist/` folder:
- `SynapseGrid-1.0.0-x64.exe` - NSIS Installer (~200MB)
- `SynapseGrid-1.0.0-x64.msi` - MSI Installer (~200MB)
- `SynapseGrid-1.0.0-portable.exe` - Portable version (~200MB)

---

## GitHub Setup

### Step 1: Configure Repository

1. Go to [https://github.com/DeepxkJadhav/SYNAPSE-GRID](https://github.com/DeepxkJadhav/SYNAPSE-GRID)
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Create a new repository secret:
   - **Name**: `GITHUB_TOKEN` (usually already available)
   - **Value**: Your GitHub Personal Access Token

### Step 2: Create Personal Access Token

1. Go to GitHub Settings → [Developer settings](https://github.com/settings/tokens)
2. Click **Generate new token** → **Generate new token (classic)**
3. Set these scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
   - `write:packages` (Upload packages)
4. Copy the token and save it as a secret

### Step 3: Enable GitHub Actions

1. Go to repository **Settings**
2. Click **Actions** → **General**
3. Ensure **Allow all actions and reusable workflows** is selected
4. Save

---

## Creating Releases

### Automated Release (Recommended)

#### Using Git Tags
```bash
# Ensure all changes are committed
git add .
git commit -m "Release v1.0.0"

# Create and push a release tag
git tag -a v1.0.0 -m "SynapseGrid v1.0.0 Release"
git push origin v1.0.0
```

This will trigger the `.github/workflows/release.yml` workflow which:
1. ✅ Builds backend and frontend
2. ✅ Creates Windows executables
3. ✅ Uploads to GitHub Releases
4. ✅ Creates release notes

#### Check Release Status
1. Go to **Actions** tab in GitHub
2. View the running workflow
3. Once complete, go to **Releases** to verify

### Manual Release (Alternative)

```bash
# Build locally
npm run dist

# Create release on GitHub manually:
# 1. Go to Releases → Draft a new release
# 2. Tag version: v1.0.0
# 3. Add release notes from RELEASE_NOTES.md
# 4. Upload files from dist/ folder
# 5. Publish
```

---

## Deploying to Production

### For End Users

#### Installation Options
1. **MSI Installer** (Recommended for enterprises)
   - Run `SynapseGrid-1.0.0-x64.msi`
   - Follow wizard
   - Creates Start Menu shortcuts

2. **NSIS Installer** (Standard installation)
   - Run `SynapseGrid-1.0.0-x64.exe`
   - Choose installation directory
   - Creates uninstaller

3. **Portable Version** (No installation)
   - Extract and run `SynapseGrid-1.0.0-portable.exe`
   - No system registry modifications
   - Can run from USB drive

### Update Deployment

For auto-updates:

1. Configure `electron-updater` in `src/main/main.ts`:
```typescript
const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();
```

2. Update `electron-package.json` publish settings:
```json
"publish": {
  "provider": "github",
  "owner": "DeepxkJadhav",
  "repo": "SYNAPSE-GRID"
}
```

3. Users will be notified of updates automatically

### Docker Deployment (Server)

```bash
# Build Docker image
docker build -t synapsegrid:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  -p 5000:5000 \
  -e OPENAI_API_KEY=sk-your_key \
  synapsegrid:latest
```

---

## Troubleshooting

### Build Issues

#### "electron-builder not found"
```bash
npm install --save-dev electron-builder
npm run dist
```

#### "Python not in PATH"
```bash
# Windows
npm install --global windows-build-tools

# Or ensure Python is in PATH
set PATH=C:\Python39;%PATH%
npm run dist
```

#### Build takes too long
```bash
# Skip code signing (development)
npm run dist -- --publish never
```

### Release Issues

#### "GitHub Actions workflow failed"
1. Check **Actions** tab for error logs
2. Verify `GITHUB_TOKEN` has correct permissions
3. Ensure tag format is `v*` (e.g., `v1.0.0`)

#### "Release files not uploading"
```bash
# Verify files exist
dir dist\*.exe
dir dist\*.msi

# Check file sizes are > 100MB
# (electron bundles are large)
```

### Deployment Issues

#### App won't start on Windows
```bash
# Check application data folder
%APPDATA%\SynapseGrid\logs\

# Reinstall Visual C++ Redistributable
# https://support.microsoft.com/en-us/help/2977003/
```

#### Port 5000/3000 already in use
```bash
# Change port in .env
BACKEND_PORT=5001
NEXT_PUBLIC_API_URL=http://localhost:5001

# Rebuild and deploy
npm run dist
```

#### Cannot read from database
```bash
# Initialize database
npm run db:setup

# Or check PostgreSQL is running
psql -U postgres -d synapsegrid_db
```

---

## Version Management

### Semantic Versioning

Follow [semver.org](https://semver.org/):
- `MAJOR` - Breaking changes
- `MINOR` - New features (backward compatible)
- `PATCH` - Bug fixes

### Release Branches

```bash
# Create release branch
git checkout -b release/v1.0.0

# Make final adjustments
# Update version in package.json
# Update RELEASE_NOTES.md

# Merge to main
git checkout main
git merge release/v1.0.0

# Tag and push
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin main
git push origin v1.0.0
```

---

## Continuous Integration

### GitHub Actions Workflows

#### Release Workflow (`.github/workflows/release.yml`)
- **Triggered**: On `v*` tags
- **Builds**: Windows executables
- **Publishes**: To GitHub Releases
- **Duration**: ~15-20 minutes

#### CI/CD Workflow (`.github/workflows/ci-cd.yml`)
- **Triggered**: On push to main/develop
- **Tests**: Runs on multiple Node versions
- **Security**: Runs npm audit
- **Builds**: Creates artifacts

---

## Monitoring & Analytics

### Track Downloads
```bash
# GitHub Releases provides download counts
# View at: https://github.com/DeepxkJadhav/SYNAPSE-GRID/releases
```

### Collect Feedback
```bash
# Add issue templates for bug reports
# Create Discussion forums for feature requests
```

### Monitor Performance
```bash
# Check error logs
tail -f ~/.config/SynapseGrid/logs/error.log

# Monitor system usage
# Use Host Control API: GET /api/host/system-info
```

---

## Security Best Practices

1. **Code Signing** (Production)
   ```bash
   npm run dist -- --win --sign ./certificate.pfx
   ```

2. **Environment Variables**
   - Never commit `.env` files
   - Use GitHub Secrets for sensitive data
   - Rotate API keys regularly

3. **Dependencies**
   ```bash
   # Check for vulnerabilities
   npm audit
   npm update
   ```

4. **Release Signing**
   - Sign commits: `git commit -S`
   - Sign tags: `git tag -s`

---

## Support

For issues or questions:
- 📧 Email: team@synapsegrid.dev
- 🐛 GitHub Issues: [Report a bug](https://github.com/DeepxkJadhav/SYNAPSE-GRID/issues)
- 💬 Discussions: [Start a discussion](https://github.com/DeepxkJadhav/SYNAPSE-GRID/discussions)
- 📖 Documentation: [README.md](https://github.com/DeepxkJadhav/SYNAPSE-GRID/blob/main/README.md)

---

**Last Updated**: May 5, 2026
**SynapseGrid Version**: 1.0.0
