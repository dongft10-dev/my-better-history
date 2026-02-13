#!/usr/bin/env node

/**
 * Build script for Vue Better History Chrome Extension
 * This script prepares the extension for packaging
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');

console.log('Building Vue Better History extension...');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy public directory contents to dist
function copyPublicFiles(src, dest) {
  const items = fs.readdirSync(src);

  for (let item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyPublicFiles(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyPublicFiles(publicDir, distDir);
  console.log('✓ Public files copied to dist/');
  
  // Note: Actual Vue build would happen here with a real build process
  console.log('\nTo complete the build:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm run build');
  console.log('3. The packaged extension will be in the dist/ folder');
  console.log('4. Load the dist/ folder as an unpacked extension in Chrome');
  
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}