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
const projectRoot = path.resolve(__dirname, '..');

const distDir = path.join(projectRoot, 'dist');
const publicDir = path.join(projectRoot, 'public');
const manifestPath = path.join(projectRoot, 'manifest.json');
const backgroundPath = path.join(projectRoot, 'background.js');

console.log('Building Vue Better History extension...');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

function copyPublicFiles(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Warning: Source directory does not exist: ${src}`);
    return;
  }
  
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

async function buildExtension() {
  try {
    console.log('Running Vite build...');
    const { execSync } = await import('child_process');
    execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
    
    if (fs.existsSync(manifestPath)) {
      fs.copyFileSync(manifestPath, path.join(distDir, 'manifest.json'));
      console.log('Manifest file copied to dist/');
    } else {
      console.warn('Warning: manifest.json not found in project root');
    }
    
    if (fs.existsSync(backgroundPath)) {
      fs.copyFileSync(backgroundPath, path.join(distDir, 'background.js'));
      console.log('Background script copied to dist/');
    } else {
      console.warn('Warning: background.js not found in project root');
    }
    
    copyPublicFiles(publicDir, distDir);
    console.log('Public files copied to dist/');
    
    const publicDistDir = path.join(distDir, 'public');
    if (fs.existsSync(publicDistDir)) {
      const files = fs.readdirSync(publicDistDir);
      for (const file of files) {
        if (path.extname(file) === '.html') {
          const srcPath = path.join(publicDistDir, file);
          const destPath = path.join(distDir, file);
          
          if (!fs.existsSync(destPath)) {
            fs.renameSync(srcPath, destPath);
            console.log(`Moved ${file} to root dist directory`);
          } else {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Updated ${file} in root dist directory`);
            fs.unlinkSync(srcPath);
          }
        }
      }
      
      const remainingFiles = fs.readdirSync(publicDistDir);
      if (remainingFiles.length === 0) {
        fs.rmdirSync(publicDistDir);
        console.log('Removed empty public subdirectory');
      }
    }
    
    const localesDir = path.join(distDir, 'locales');
    const underscoreLocalesDir = path.join(distDir, '_locales');
    
    if (fs.existsSync(localesDir)) {
      if (fs.existsSync(underscoreLocalesDir)) {
        fs.rmSync(underscoreLocalesDir, { recursive: true, force: true });
      }
      
      fs.renameSync(localesDir, underscoreLocalesDir);
      console.log('Locales directory renamed to _locales for Chrome extension');
    }
    
    console.log('\nBuild completed successfully!');
    console.log('\nTo load the extension in Chrome:');
    console.log('1. Open Chrome and navigate to chrome://extensions');
    console.log('2. Enable "Developer mode"');
    console.log('3. Click "Load unpacked"');
    console.log('4. Select the "dist" folder in this project');
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildExtension();
