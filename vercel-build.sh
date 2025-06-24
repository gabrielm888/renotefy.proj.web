#!/bin/bash

# Log the build process
echo "Starting Vercel build for Renotefy Web App..."
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Clean install dependencies
echo "Installing dependencies..."
npm ci

# Build the project with Vite
echo "Building project with Vite..."
npm run build

# Verify build output
echo "Build complete. Files in dist directory:"
ls -la dist/

echo "Build process finished successfully!"
