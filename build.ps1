#!/usr/bin/env pwsh

<#
.SYNOPSIS
    SynapseGrid Windows Build Script
.DESCRIPTION
    Builds SynapseGrid executable for Windows (NSIS, MSI, and Portable)
#>

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "    SynapseGrid v1.0.0 - Build Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check for Node.js
$nodeCheck = & { node --version } 2>&1
if (-not $?) {
    Write-Host "❌ Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "   Please install Node.js 20+ from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Node.js found: $nodeCheck" -ForegroundColor Green

# Check for npm
$npmCheck = & { npm --version } 2>&1
if (-not $?) {
    Write-Host "❌ Error: npm is not installed or not in PATH" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ npm found: $npmCheck" -ForegroundColor Green

Write-Host ""
Write-Host "Step 1: Installing dependencies..." -ForegroundColor Yellow
Write-Host ""
npm ci
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 2: Building backend..." -ForegroundColor Yellow
Write-Host ""
npm run build -w @synapse/backend
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build backend" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 3: Building frontend..." -ForegroundColor Yellow
Write-Host ""
npm run build -w @synapse/frontend
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build frontend" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 4: Creating Windows executable..." -ForegroundColor Yellow
Write-Host ""
npm run dist
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create Windows executable" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "    ✅ Build completed successfully!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Output files located in: dist\" -ForegroundColor Cyan
Write-Host ""
Get-ChildItem -Path dist -Filter "*.exe" | ForEach-Object { 
    Write-Host "  - $($_.Name) ($([Math]::Round($_.Length / 1MB, 2)) MB)" -ForegroundColor White
}
Get-ChildItem -Path dist -Filter "*.msi" | ForEach-Object { 
    Write-Host "  - $($_.Name) ($([Math]::Round($_.Length / 1MB, 2)) MB)" -ForegroundColor White
}

Write-Host ""
Write-Host "Ready to deploy! You can now:" -ForegroundColor Yellow
Write-Host "  1. Upload files to GitHub Releases" -ForegroundColor White
Write-Host "  2. Distribute SynapseGrid-*.exe to users" -ForegroundColor White
Write-Host "  3. Run the .msi installer or portable version" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
