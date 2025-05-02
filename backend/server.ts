import 'dotenv/config';

import express from 'express';
import body_parser from 'body-parser';
import cors from 'cors';
// import { diabetesRagAgent } from './diabetesRagAgent.js';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

// Middleware to parse JSON requests
app.use(body_parser.json());
app.use(cors());

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

// Preload documents before starting the server
(async () => {
  try {
    console.log('Preloading diabetes documents and vector stores...');
    // await diabetesRagAgent.preloadDocuments();
    console.log('Documents loaded. Starting server...');
    app.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to preload documents:', err);
    process.exit(1);
  }
})();