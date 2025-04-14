#!/usr/bin/env node

/**
 * This script runs only the Next.js application, bypassing Express completely
 */

import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get timestamp for logging
function getTimestamp() {
  const now = new Date();
  return `${now.toLocaleTimeString()}`;
}

// Log a message with timestamp
function logMessage(message, type = 'info') {
  const timestamp = getTimestamp();
  const color = type === 'error' ? '\x1b[31m' : type === 'success' ? '\x1b[32m' : '\x1b[36m';
  console.log(`${color}${timestamp}\x1b[0m [nextjs] ${message}`);
}

logMessage('Starting Next.js application (No Express)');
logMessage('Running Next.js development server on port 3000');

// Run Next.js development server
const nextProcess = exec('npx next dev', { cwd: __dirname });

nextProcess.stdout.on('data', (data) => {
  console.log(data.toString().trim());
});

nextProcess.stderr.on('data', (data) => {
  console.error(data.toString().trim());
});

nextProcess.on('close', (code) => {
  if (code !== 0) {
    logMessage(`Next.js process exited with code ${code}`, 'error');
    process.exit(code);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  logMessage('Shutting down Next.js...', 'info');
  nextProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logMessage('Shutting down Next.js...', 'info');
  nextProcess.kill('SIGTERM');
  process.exit(0);
});