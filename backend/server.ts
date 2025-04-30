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

// Preload documents before starting the server
(async () => {
  try {
    console.log("Preloading diabetes documents and vector stores...");
    await diabetesRagAgent.preloadDocuments();
    console.log("Documents loaded. Starting server...");
    app.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to preload documents:", err);
    process.exit(1);
  }
})();