require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 💬 KI-Chat-Endpunkt
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Du bist eine empathische Jobberatung, die Potenziale erkennt, nicht nur Zertifikate.' },
        { role: 'user', content: userMessage },
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('Chat Error:', error.message);
    res.status(500).json({ reply: 'Ein Fehler ist aufgetreten.' });
  }
});

// 🔍 Neue Route: Jobsuche per API
app.post('/api/jobs', async (req, res) => {
  const { query, location } = req.body;

  try {
    const response = await axios.get('https://api.deine-jobquelle.de/v1/jobs', {
      params: {
        keyword: query,
        location: location || 'Rostock',
        limit: 5,
      },
      headers: {
        Authorization: `Bearer ${process.env.JOB_API_KEY}`, // Job-API-Key in .env!
      },
    });

    const jobs = response.data.jobs || [];
    res.json({ jobs });
  } catch (error) {
    console.error('Job API Error:', error.message);
    res.status(500).json({ error: 'Fehler beim Abrufen der Jobs.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server läuft auf Port ${PORT}`));
