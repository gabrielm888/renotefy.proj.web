#!/bin/bash

# Exit on any error, but display the error
set -e

# Log the build process
echo "Starting Vercel build for Renotefy Web App..."
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Display environment (except secrets)
echo "Environment variables (non-sensitive):"
env | grep -v -E '(KEY|TOKEN|SECRET|PASSWORD)' || true

# Clean install dependencies
echo "Installing dependencies..."
npm ci --prefer-offline --no-audit

# Check for package issues
echo "Checking for package issues..."
npm list || true

# Build the project with Vite in production mode
echo "Building project with Vite (production mode)..."
NODE_ENV=production npm run build

# Verify the CSS files to ensure they are being generated and included properly
echo "Checking for CSS files in build output:"
find dist -name "*.css" | sort

# Verify build output
echo "Build complete. Files in dist directory:"
ls -la dist/

echo "Content of dist/index.html (first 50 lines):"
head -n 50 dist/index.html

echo "Build process finished successfully!"
