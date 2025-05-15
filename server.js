require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const path = require('path');
const { default: axios } = require('axios');
const axios = require(axios);
const { jobsSearch } = require('jobsuche-api-js');

const app = express();
app.use(express.static(__dirname));

app.use(cors());
app.use(express.json());

//const client = new OpenAI();

//const response = await client.responses.create({
//    model: "gpt-4.1-turbo",
//    input: "Write a one-sentence bedtime story about a unicorn.",
//});

//console.log(response.output_text);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4.1 turbo',
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

async function fetchJobs(keyword, ort = 'Berlin') {
  try {
    const response = await axios.get(
      'https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobs',
      {
        headers: {
          'X-API-Key': 'jobboerse-jobsuche'
        },
        params: {
          was: keyword,
          wo: ort,
          size: 5 // Anzahl der zurückgegebenen Jobs
        }
      }
    );

    const jobs = response.data?.stellenangebote || [];
    return jobs.map(job => ({
      titel: job.beruf,
      arbeitgeber: job.arbeitgeber,
      ort: job.arbeitsort,
      link: job.links[0]?.url
    }));
  } catch (error) {
    console.error('Fehler beim Abrufen der Jobs:', error.message);
    return [];
  }
}

const { jobsSearch } = require('jobsuche-api-js');

async function searchJobs() {
  const searchParams = { what: 'Sozialarbeit', where: 'Berlin' };
  try {
    const results = await jobsSearch(searchParams);
    console.log(results);
  } catch (error) {
    console.error('Fehler beim Abrufen der Jobs:', error);
  }
}

searchJobs();
