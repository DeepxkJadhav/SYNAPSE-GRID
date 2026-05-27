# GitHub Setup for SynapseGrid Releases

## 📋 Complete Setup Checklist

### Step 1: Repository Setup ✅

#### 1.1 Clone Repository
```bash
git clone https://github.com/DeepxkJadhav/SYNAPSE-GRID.git
cd SYNAPSE-GRID
```

#### 1.2 Configure Git User
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

#### 1.3 Create Main Branch (if needed)
```bash
git checkout -b main
git push -u origin main
```

---

### Step 2: GitHub Secrets Configuration ✅

#### 2.1 Create Personal Access Token (PAT)

1. Go to GitHub Settings: https://github.com/settings/profile
2. Click **Developer settings** (bottom left)
3. Click **Personal access tokens** → **Tokens (classic)**
4. Click **Generate new token (classic)**

**Required Scopes:**
- ✅ `repo` - Full control of private repositories
- ✅ `workflow` - Update GitHub Action workflows
- ✅ `write:packages` - Upload and download packages

5. Copy the token (you won't see it again!)

#### 2.2 Add Secrets to Repository

1. Go to: https://github.com/DeepxkJadhav/SYNAPSE-GRID/settings/secrets/actions
2. Click **New repository secret**
3. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `GITHUB_TOKEN` | Your Personal Access Token (PAT) |
| `OPENAI_API_KEY` | Your OpenAI API key (optional) |

---

### Step 3: Enable GitHub Actions ✅

1. Go to **Settings** tab
2. Click **Actions** → **General**
3. Under "Actions permissions":
   - Select ✅ **Allow all actions and reusable workflows**
4. Scroll down to **Workflow permissions**:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

---

### Step 4: Configure Release Settings ✅

1. Go to **Settings** → **Pages**
2. Under "Build and deployment":
   - **Source**: Deploy from a branch
   - **Branch**: `main` / `docs` (if applicable)

3. Go to **Settings** → **Branches**
4. Under "Branch protection rules" (optional):
   - Add rule for `main` branch
   - Require status checks before merging
   - Require reviews before merging

---

## 🚀 Creating Your First Release

### Option A: Automatic Release (Recommended)

```bash
# 1. Update version in package.json
# nano package.json or edit in VS Code

# 2. Create a release branch
git checkout -b release/v1.0.0

# 3. Make any final changes
# Edit package.json, RELEASE_NOTES.md, etc.

# 4. Commit changes
git add .
git commit -m "chore: prepare v1.0.0 release"

# 5. Push to GitHub
git push -u origin release/v1.0.0

# 6. Create Pull Request
# Go to GitHub, create PR from release/v1.0.0 to main

# 7. Merge to main
# After review, merge the PR

# 8. Create Release Tag (triggers GitHub Actions)
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

**GitHub Actions will automatically:**
- ✅ Build backend and frontend
- ✅ Create Windows executables
- ✅ Upload to GitHub Releases
- ✅ Create release notes

### Option B: Manual Build & Release

```bash
# 1. Build locally
npm run dist

# 2. Verify outputs
ls -la dist/*.exe

# 3. Go to GitHub Releases
# https://github.com/DeepxkJadhav/SYNAPSE-GRID/releases

# 4. Click "Draft a new release"

# 5. Fill in:
# - Tag version: v1.0.0
# - Release title: SynapseGrid v1.0.0
# - Description: Paste from RELEASE_NOTES.md

# 6. Upload files from dist/
# - SynapseGrid-1.0.0-x64.exe
# - SynapseGrid-1.0.0-x64.msi
# - SynapseGrid-1.0.0-portable.exe

# 7. Check "Set as the latest release"

# 8. Click "Publish release"
```

---

## 📊 Monitor GitHub Actions Workflow

### 1. View Workflow Runs
- Go to **Actions** tab
- Select **Build and Release SynapseGrid** workflow
- See all runs with status

### 2. View Logs
- Click on a run to see details
- Click on **build-windows** job
- See all build steps and logs

### 3. Download Artifacts
- Go to **Artifacts** section (if available)
- Download files for testing before release

---

## 🔍 Verify Release

### Check Release Published
1. Go to **Releases** tab
2. Should see your new release with:
   - ✅ Release title and description
   - ✅ Asset files (SynapseGrid-*.exe, *.msi)
   - ✅ File sizes and upload dates

### Test Download
```bash
# Download and verify file integrity
curl -L -o SynapseGrid-1.0.0-x64.exe \
  "https://github.com/DeepxkJadhav/SYNAPSE-GRID/releases/download/v1.0.0/SynapseGrid-1.0.0-x64.exe"

# Verify file size
ls -lh SynapseGrid-1.0.0-x64.exe
```

---

## 🔐 Security Considerations

### Access Control
- ✅ Enable branch protection on `main`
- ✅ Require pull request reviews
- ✅ Limit who can merge releases

### Secret Management
- ✅ Rotate PAT every 90 days
- ✅ Never commit secrets to repo
- ✅ Use environment variables in Actions

### Code Signing (Production)
```bash
# Sign commits
git commit -S -m "Release v1.0.0"

# Verify signed commits
git verify-commit <commit-hash>
```

---

## 📦 Automating Releases

### Semantic Versioning
Update `package.json` version following semver:
```json
{
  "version": "1.0.0"
}
```

Format: `MAJOR.MINOR.PATCH`
- `1.0.0` → `1.0.1` (patch fix)
- `1.0.0` → `1.1.0` (minor feature)
- `1.0.0` → `2.0.0` (major breaking change)

### Release Changelog

Update `RELEASE_NOTES.md`:
```markdown
# SynapseGrid v1.0.1

## 🐛 Bug Fixes
- Fixed compiler timeout issue
- Improved database connection handling

## ✨ New Features
- Added support for Julia language
- Enhanced host control monitoring
```

---

## 🆘 Troubleshooting

### GitHub Actions Won't Run
**Problem**: Workflow file not triggering
**Solution**:
```bash
# Verify workflow file syntax
yamllint .github/workflows/release.yml

# Check branch name matches
git branch
# Should show main or develop branch
```

### Token Permission Denied
**Problem**: `fatal: could not read Username`
**Solution**:
```bash
# Use personal access token
git remote set-url origin \
  https://YOUR_PAT@github.com/DeepxkJadhav/SYNAPSE-GRID.git

# Or use SSH
git remote set-url origin \
  git@github.com:DeepxkJadhav/SYNAPSE-GRID.git
```

### Release Files Too Large
**Problem**: Upload timeout
**Solution**:
```bash
# Use electron-builder compression
npm run dist -- --win --msiOptions="/compress:max"
```

### Actions Not Creating Release
**Problem**: Workflow runs but no release created
**Solution**:
1. Check workflow logs for errors
2. Verify tag format: `v*` (e.g., `v1.0.0`)
3. Check `RELEASE_NOTES.md` exists
4. Ensure `GITHUB_TOKEN` has write permissions

---

## 📚 Additional Resources

### GitHub Documentation
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Creating Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

### Electron Builder
- [Electron Builder Documentation](https://www.electron.build/)
- [GitHub Release Publishing](https://www.electron.build/publishing)

### Best Practices
- Keep `main` branch stable
- Use feature branches for development
- Test locally before creating tags
- Use descriptive commit messages

---

## ✅ Final Checklist

Before first release:
- [ ] Repository cloned and configured
- [ ] GitHub token created and added to secrets
- [ ] GitHub Actions enabled
- [ ] Branch protection enabled (optional)
- [ ] .github/workflows files in place
- [ ] package.json version updated
- [ ] RELEASE_NOTES.md prepared
- [ ] Test build runs successfully: `npm run dist`
- [ ] Ready to create tag and push

---

**First Release Ready! 🚀**

Push your first tag:
```bash
git tag -a v1.0.0 -m "SynapseGrid v1.0.0 Release"
git push origin v1.0.0
```

Watch the magic happen in the **Actions** tab! ✨
