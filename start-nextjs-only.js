#!/usr/bin/env node

// Script to start only Next.js application (no Express)
import { spawn } from 'child_process';

console.log('Starting Next.js-only application (no Express backend)...');

// Step 1: Kill any running Express server on port 5000
console.log('Checking for running Express server...');
const findProcess = spawn('lsof', ['-i', ':5000']);
findProcess.stdout.on('data', (data) => {
  const output = data.toString();
  const lines = output.split('\n');
  
  // The first line is the header, so skip it
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const parts = line.split(/\s+/);
      const pid = parts[1];
      if (pid) {
        console.log(`Found Express server running with PID ${pid}, shutting it down...`);
        try {
          process.kill(parseInt(pid, 10), 'SIGTERM');
        } catch (err) {
          console.error(`Failed to kill process ${pid}:`, err.message);
        }
      }
    }
  }

  // After potentially killing Express, start Next.js
  startNextJs();
});

findProcess.stderr.on('data', (data) => {
  console.error(`Error finding process: ${data}`);
  // If there's an error finding the process, we'll still try to start Next.js
  startNextJs();
});

findProcess.on('close', (code) => {
  if (code !== 0) {
    console.log('No Express server found running on port 5000');
    startNextJs();
  }
});

function startNextJs() {
  console.log('Starting Next.js development server...');
  
  // Run Next.js development server
  const nextProcess = spawn('npx', ['next', 'dev', '-p', '3000'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('Shutting down Next.js...');
    nextProcess.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('Shutting down Next.js...');
    nextProcess.kill('SIGTERM');
    process.exit(0);
  });

  nextProcess.on('error', (err) => {
    console.error('Failed to start Next.js:', err);
  });

  nextProcess.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`);
    process.exit(code);
  });
}