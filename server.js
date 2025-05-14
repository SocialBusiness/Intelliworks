require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAIApi, Configuration } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
    model: "gpt-4.1",
    input: "Write a one-sentence bedtime story about a unicorn.",
});

console.log(response.output_text);


app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Du bist eine empathische Jobberatung, die Potenziale erkennt, nicht nur Zertifikate.' },
        { role: 'user', content: userMessage },
      ],
    });

    res.json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ reply: 'Ein Fehler ist aufgetreten.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
