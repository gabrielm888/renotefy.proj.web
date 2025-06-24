#!/bin/bash

# Exit on any error
set -e

# Log the build process
echo "Starting Vercel build for Renotefy Web App..."
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Clean install dependencies
echo "Installing dependencies..."
npm ci --prefer-offline --no-audit

# Check for issues
echo "Checking for issues..."
npm list || true

# Build the project with Vite
echo "Building project with Vite..."
npm run build

# Verify build output
echo "Build complete. Files in dist directory:"
ls -la dist/

echo "Build process finished successfully!"
