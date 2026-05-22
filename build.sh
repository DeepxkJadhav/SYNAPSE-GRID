#!/bin/bash

# SynapseGrid Build Script for Linux/macOS

set -e

echo ""
echo "============================================"
echo "    SynapseGrid v1.0.0 - Build Script"
echo "============================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed or not in PATH"
    echo "   Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed or not in PATH"
    exit 1
fi

echo "✅ npm found: $(npm --version)"

echo ""
echo "Step 1: Installing dependencies..."
echo ""
npm ci

echo ""
echo "Step 2: Building backend..."
echo ""
npm run build -w @synapse/backend

echo ""
echo "Step 3: Building frontend..."
echo ""
npm run build -w @synapse/frontend

echo ""
echo "Step 4: Building application..."
echo ""
npm run build

echo ""
echo "============================================"
echo "    ✅ Build completed successfully!"
echo "============================================"
echo ""
echo "📦 Build artifacts ready in: dist/"
echo ""
echo "Note: To build Windows executables, run on Windows or:"
echo "  docker run -v $(pwd):/project -w /project -e USE_SYSTEM_FPM=true node:20 npm run dist"
echo ""
