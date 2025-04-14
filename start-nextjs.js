// Script to start Next.js development server
import { spawn } from 'child_process';
import chalk from 'chalk';

// Helper function to create a timestamp
function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString();
}

// Logger with source identification
function logMessage(message, type = 'info') {
  const timestamp = getTimestamp();
  const color = type === 'error' ? 'red' : 
                type === 'warning' ? 'yellow' : 'blue';
  
  console.log(chalk[color](`${timestamp} [next-dev] ${message}`));
}

logMessage('Starting SpiritualFit Next.js app...');
logMessage('This will start the Next.js server which handles both frontend and API routes');
console.log(chalk.gray('-------------------------------------------------------------'));

// Start Next.js server
const nextProcess = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '-p', '3000'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  env: { ...process.env, NODE_ENV: 'development' }
});

// Handle Next.js output
nextProcess.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => logMessage(line));
});

nextProcess.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => logMessage(line, 'error'));
});

// Handle process errors
nextProcess.on('error', (err) => {
  logMessage(`Failed to start Next.js: ${err.message}`, 'error');
});

// Handle process exit
nextProcess.on('close', (code) => {
  logMessage(`Next.js exited with code: ${code}`, code !== 0 ? 'error' : 'info');
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  logMessage('Shutting down...', 'warning');
  nextProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logMessage('Shutting down...', 'warning');
  nextProcess.kill('SIGTERM');
  process.exit(0);
});