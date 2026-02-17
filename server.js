import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Initialize Groq properly
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Groq AI Server Running 🚀");
});

app.post("/analyze", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages are required" });
    }

    console.log("Incoming messages:", messages);

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: messages,
    });

    res.json({
      reply: chatCompletion.choices[0].message.content,
    });

  } catch (error) {
    console.error("BACKEND ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "AI Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
