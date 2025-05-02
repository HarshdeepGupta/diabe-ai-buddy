import 'dotenv/config';

import express from 'express';
import body_parser from 'body-parser';
import cors from 'cors';
import { networkInterfaces } from 'os';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

// Middleware to parse JSON requests
app.use(body_parser.json());
app.use(cors());

// Function to get local IP addresses
const getLocalIPs = () => {
  const nets = networkInterfaces();
  const results: string[] = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      // Skip internal and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        results.push(net.address);
      }
    }
  }
  return results;
};

// API endpoint to process questions
app.post('/api/answerQuestion', async (req, res) => {
  const { question, category, conversationHistory } = req.body;

  // try {
  //   const result = await diabetesRagAgent.answerQuestion(
  //     question,
  //     category,
  //     conversationHistory
  //   );
  //   res.status(200).json(result);
  // } catch (error) {
  //   console.error('Error in RAG agent:', error);
  //   res.status(500).json({ error: 'Failed to process the question.' });
  // }
  res.status(200).json({ answer: 'This is a mock answer.' });
});

// Basic route handlers with improved logging
app.get('/', (req, res) => {
  console.log('GET / - Home route accessed');
  res.status(200).send('Hello from the backend!');
});

app.get('/health', (req, res) => {
  console.log('GET /health - Health check accessed');
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Add error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Add 404 handler
app.use((req: express.Request, res: express.Response) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});

// Create server instance separately from listening
const server = app.listen(PORT, () => {
  const localIPs = getLocalIPs();
  console.log('\nServer is running on:');
  console.log(`• Local:            http://localhost:${PORT}`);
  localIPs.forEach(ip => {
    console.log(`• Network:          http://${ip}:${PORT}`);
  });
  console.log('\nYou can test the health endpoint at:');
  console.log(`• Local:            http://localhost:${PORT}/health`);
  localIPs.forEach(ip => {
    console.log(`• Network:          http://${ip}:${PORT}/health`);
  });
  console.log('\nPress CTRL+C to stop the server');
});

// Handle process events for graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    console.info('HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  server.close(() => {
    process.exit(1);
  });
});

// Keep the process alive
process.stdin.resume();

// Modify the startup IIFE
(async () => {
  try {
    console.log('Preloading diabetes documents and vector stores...');
    // await diabetesRagAgent.preloadDocuments();
    console.log('Documents loaded.');
  } catch (err) {
    console.error('Failed to preload documents:', err);
    process.exit(1);
  }
})();