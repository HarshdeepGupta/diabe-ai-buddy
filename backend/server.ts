
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the CORS middleware
const { diabetesRagAgent } = require("./diabetesRagAgent"); // Import your agent

const app = express();
const PORT = 3001;

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors());

// API endpoint to process questions
app.post("/api/answerQuestion", async (req, res) => {
  const { question, category, conversationHistory } = req.body;

  try {
    const result = await diabetesRagAgent.answerQuestion(
      question,
      category,
      conversationHistory
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in RAG agent:", error);
    res.status(500).json({ error: "Failed to process the question." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
  console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
});