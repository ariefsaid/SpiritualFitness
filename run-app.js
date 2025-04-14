// Script to run both Express API and Next.js frontend
const { spawn } = require('child_process');
const chalk = require('chalk');

// Helper function to create a timestamp
function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString();
}

// Logger with source identification
function logMessage(message, source, type = 'info') {
  const timestamp = getTimestamp();
  const color = type === 'error' ? 'red' : 
                source === 'express' ? 'green' : 
                source === 'next' ? 'blue' : 'yellow';
  
  console.log(chalk[color](`${timestamp} [${source}] ${message}`));
}

logMessage('Starting SpiritualFit app...', 'system');
logMessage('This will start:', 'system');
logMessage('  - Express API server on port 5000', 'system');
logMessage('  - Next.js frontend on port 3000', 'system');
console.log(chalk.gray('-------------------------------------------------------------'));

// Start Next.js server
const nextProcess = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '-p', '3000'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  env: { ...process.env, NODE_ENV: 'development' }
});

// Start Express API server
const expressProcess = spawn('tsx', ['server/index.ts'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  env: { ...process.env, NODE_ENV: 'development' }
});

// Handle Next.js output
nextProcess.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => logMessage(line, 'next'));
});

nextProcess.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => logMessage(line, 'next', 'error'));
});

// Handle Express output
expressProcess.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => logMessage(line, 'express'));
});

expressProcess.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => logMessage(line, 'express', 'error'));
});

// Handle process errors
nextProcess.on('error', (err) => {
  logMessage(`Failed to start Next.js: ${err.message}`, 'next', 'error');
});

expressProcess.on('error', (err) => {
  logMessage(`Failed to start Express: ${err.message}`, 'express', 'error');
});

// Handle process exit
nextProcess.on('close', (code) => {
  logMessage(`Next.js exited with code: ${code}`, 'next', code !== 0 ? 'error' : 'info');
  
  // If Next.js exits, also terminate Express
  if (expressProcess) {
    expressProcess.kill();
  }
  process.exit(code);
});

expressProcess.on('close', (code) => {
  logMessage(`Express exited with code: ${code}`, 'express', code !== 0 ? 'error' : 'info');
  
  // If Express exits, also terminate Next.js
  if (nextProcess) {
    nextProcess.kill();
  }
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  logMessage('Shutting down...', 'system');
  nextProcess.kill('SIGINT');
  expressProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logMessage('Shutting down...', 'system');
  nextProcess.kill('SIGTERM');
  expressProcess.kill('SIGTERM');
  process.exit(0);
});