require('dotenv').config();
const Groq = require('groq-sdk');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post('/generate', async (req, res) => {
  try {
    const prompt = `
Please create the following parts in this format:

Title: [a short, attractive SEO title with at least 5 words, including the main keyword]
Hashtags: [3 relevant hashtags separated by spaces, without commas]
Description: [an SEO description of at least 250 words, mentioning the main keyword 2-4 times naturally, including a call-to-action]

Use the language based on the content below. If the content is mostly in English, respond in English. If it is mostly in Indonesian, respond in Indonesian.

Here is the content to analyze:

${req.body.prompt}
    `;
    const response = await client.chat.completions.create({
      model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ result: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error calling Groq API' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
