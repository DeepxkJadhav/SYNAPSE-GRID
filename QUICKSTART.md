# Quick Start Guide - SynapseGrid Desktop App

## 🚀 Installation

### Choose Your Installation Method

#### 1️⃣ Standard Installer (Recommended)
```
Download: SynapseGrid-1.0.0-x64.exe
1. Double-click the installer
2. Follow the setup wizard
3. Click "Install"
4. Launch from Start Menu
```

#### 2️⃣ Windows Package Manager
```
Download: SynapseGrid-1.0.0-x64.msi
Right-click → Install Package
Or: msiexec /i SynapseGrid-1.0.0-x64.msi
```

#### 3️⃣ Portable Version
```
Download: SynapseGrid-1.0.0-portable.exe
Run directly - no installation needed
Can be placed on USB drive
```

---

## 🎯 First Launch

### When you start SynapseGrid for the first time:

1. **Frontend loads** at http://localhost:3000
2. **Backend starts** at http://localhost:5000
3. **Database initializes** (PostgreSQL/SQLite)
4. **You're ready to code!**

---

## 🔧 Features Overview

### 1. Live Code Editor
- **Monaco Editor** - Professional code editing
- **Syntax highlighting** for 50+ languages
- **Real-time collaboration** with team members
- **Multi-file support** with folder structure

### 2. Multi-Language Compiler
```
Supported Languages:
• Python          • JavaScript       • TypeScript
• Java            • C++              • Go
• Rust            • C#
```

**How to use:**
1. Write your code in the editor
2. Select language from dropdown
3. Click "Execute" or "Compile"
4. View output in console

### 3. AI Code Assistant
**Features:**
- 📝 **Code Review** - Get intelligent feedback
- 🐛 **Debug** - Analyze errors and get fixes
- ✨ **Generate** - Create code from descriptions
- 💡 **Explain** - Understand complex code
- ⚡ **Complete** - Smart code suggestions

**How to use:**
1. Right-click on code or select panel
2. Choose assistant action
3. View AI suggestions
4. Apply fixes with one click

### 4. Host Control Dashboard
**Monitor:**
- 📊 CPU, Memory, Disk usage
- 🔄 Running processes
- 🌐 Network information
- 📈 24-hour resource history

**Manage:**
- Terminate processes
- Find available ports
- Monitor system health

---

## 📝 Settings

### Access Settings
1. Click menu icon (☰) → Preferences
2. Configure:
   - **Theme** - Light/Dark/Auto
   - **Font** - Editor font and size
   - **Compiler** - Language and timeout settings
   - **Assistant** - OpenAI API key (optional)
   - **Shortcuts** - Keyboard shortcuts

---

## 🤝 Creating Your First Session

1. **Login/Register**
   - Click "Register" to create account
   - Or "Login" if you have one

2. **Create Session**
   - Click "New Session"
   - Enter session name
   - Choose access level

3. **Invite Team Members**
   - Click "Copy Invite Link"
   - Share with team
   - They can join instantly

4. **Start Coding**
   - Create files
   - Edit together in real-time
   - See cursor positions

---

## 🔌 Keyboard Shortcuts

### Editor
| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save file |
| `Ctrl+/` | Toggle comment |
| `Ctrl+F` | Find text |
| `Ctrl+H` | Find & replace |
| `Ctrl+G` | Go to line |
| `Ctrl+Space` | Auto-complete |

### Application
| Shortcut | Action |
|----------|--------|
| `Ctrl+Q` | Quit app |
| `Ctrl+,` | Settings |
| `F12` | Developer tools |
| `Ctrl+R` | Reload |

---

## 🐛 Troubleshooting

### App Won't Start
```
✓ Check Windows Defender/Antivirus isn't blocking it
✓ Reinstall Visual C++ Redistributable:
  https://support.microsoft.com/en-us/help/2977003/
✓ Try portable version
```

### Compiler Not Working
```
✓ Install required language tools (Python, Java, etc.)
✓ Add to PATH: C:\Program Files\Python\...
✓ Restart app after installation
```

### Slow Performance
```
✓ Check Host Control → CPU/Memory usage
✓ Close other applications
✓ Free up disk space (min 500MB)
```

### Cannot Connect to Database
```
✓ Check PostgreSQL is running
✓ View logs: %APPDATA%\SynapseGrid\logs\
✓ Reinstall: uninstall, reboot, reinstall
```

---

## 📚 Getting Help

### Documentation
- 📖 [README](https://github.com/DeepxkJadhav/SYNAPSE-GRID)
- 🎯 [Features Guide](https://github.com/DeepxkJadhav/SYNAPSE-GRID/blob/main/FEATURES.md)
- 🔌 [API Reference](https://github.com/DeepxkJadhav/SYNAPSE-GRID/blob/main/API.md)

### Support
- 🐛 [Report Issues](https://github.com/DeepxkJadhav/SYNAPSE-GRID/issues)
- 💬 [Discussions](https://github.com/DeepxkJadhav/SYNAPSE-GRID/discussions)
- 📧 Email: team@synapsegrid.dev

---

## 🔄 Updates

### Check for Updates
1. Click menu icon (☰)
2. Select "Check for Updates"
3. Follow installation prompt if available

### Auto-Updates
- SynapseGrid checks for updates on startup
- Notifies you of new versions
- Downloads in background
- Install on next restart

---

## 🔐 Security & Privacy

### Local Data
- Your code is stored locally
- Database is encrypted
- No automatic telemetry

### Cloud Sync (Optional)
- Enable in Settings → Sync
- Backup to your account
- Sync across devices

### Credentials
- Store API keys in Settings (encrypted)
- Never share session links publicly
- Logout when using shared computers

---

## 🚀 Advanced Usage

### Command Line
```bash
# Run app from terminal
SynapseGrid.exe --no-sandbox

# Enable debug mode
SynapseGrid.exe --debug

# Specify config file
SynapseGrid.exe --config path/to/config.json
```

### Developer Console
1. Press `F12` to open developer tools
2. Console tab for debugging
3. Network tab for API calls
4. Application tab for storage

### API Access
```
Backend API available at: http://localhost:5000/api
Frontend at: http://localhost:3000
WebSocket: ws://localhost:5000
```

---

## 📊 System Requirements

- **OS**: Windows 10 or 11
- **RAM**: 4GB (8GB recommended)
- **Disk**: 500MB free space
- **Display**: 1024x768 minimum
- **.NET**: 4.5+ (for C# compilation)

---

## 💡 Tips & Tricks

1. **Multi-Select**: Ctrl+Click to select multiple files
2. **Drag & Drop**: Drag files into editor
3. **Terminal Panels**: Open multiple terminals with Ctrl+Alt+T
4. **Themes**: Press Ctrl+K Ctrl+T for theme selector
5. **Command Palette**: Press Ctrl+Shift+P
6. **Zen Mode**: Press Ctrl+K Z for distraction-free editing

---

## 🆘 Still Need Help?

### Check Status
- View logs: `%APPDATA%\SynapseGrid\logs\`
- System info: Settings → About

### Report Issues
1. Describe the problem
2. Include steps to reproduce
3. Attach relevant logs
4. Post on [GitHub Issues](https://github.com/DeepxkJadhav/SYNAPSE-GRID/issues)

---

**Happy Coding! 🎉**

For more information, visit: https://github.com/DeepxkJadhav/SYNAPSE-GRID
