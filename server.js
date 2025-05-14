require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAIApi, Configuration } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

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
