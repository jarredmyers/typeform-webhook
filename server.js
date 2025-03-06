const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Store API Key in Railway Variables

app.post("/typeform-webhook", async (req, res) => {
  try {
    let userInput = req.body.form_response.answers[0].text;

    let response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a career coach providing structured guidance." },
          { role: "user", content: `User's challenge: ${userInput}. Provide coaching advice.` }
        ]
      },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" } }
    );

    let aiResponse = response.data.choices[0].message.content;
    res.json({ ai_response: aiResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI processing failed." });
  }
});

app.get("/", (req, res) => {
  res.send("Webhook is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
