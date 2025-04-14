// Enhanced Next.js server script for SpiritualFit PWA
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const chalk = require('chalk');

// Configuration
const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = 3000;

// Helper function to create a timestamp
function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString();
}

// Logger with colored output
function log(message, type = 'info') {
  const timestamp = getTimestamp();
  const color = type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue';
  console.log(chalk[color](`${timestamp} [next-server] ${message}`));
}

// Initialize Next.js
const app = next({ 
  dev, 
  hostname, 
  port,
  conf: {
    // Ensure all config matches next.config.mjs
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
      appDir: true
    },
    images: {
      domains: ['localhost']
    }
  }
});
const handle = app.getRequestHandler();

log(`Starting Next.js ${dev ? 'development' : 'production'} server...`);

// Error handling for app preparation
app.prepare()
  .then(() => {
    log('Next.js initialization complete');
    
    const server = createServer(async (req, res) => {
      try {
        // Parse URL
        const parsedUrl = parse(req.url, true);
        
        // Handle API routes differently if needed
        if (parsedUrl.pathname?.startsWith('/api/')) {
          log(`API request: ${parsedUrl.pathname}`, 'warning');
          
          // Let Next.js handle API routes that are implemented in Next.js
          // This allows for a gradual migration of API routes
          await handle(req, res, parsedUrl);
          return;
        }
        
        // Let Next.js handle the request
        await handle(req, res, parsedUrl);
      } catch (err) {
        log(`Error handling ${req.url}: ${err.message}`, 'error');
        console.error(err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });
    
    // Handle server errors
    server.on('error', (err) => {
      log(`Server error: ${err.message}`, 'error');
      console.error(err);
    });
    
    // Start listening
    server.listen(port, hostname, (err) => {
      if (err) {
        log(`Failed to start server: ${err.message}`, 'error');
        throw err;
      }
      log(`🚀 Server ready at http://${hostname}:${port}`);
      log(`📱 PWA available for installation and offline use`);
    });
  })
  .catch((err) => {
    log(`Failed to initialize Next.js: ${err.message}`, 'error');
    console.error(err);
    process.exit(1);
  });