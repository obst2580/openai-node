const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
let chatbotRole = '챗봇';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const openaiResponse = await generateResponse(userMessage);
    res.send({ message: openaiResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});
app.post('/role', express.json(), (req, res) => {
    chatbotRole = req.body.role;
    res.status(200).send('OK');
  });
  
async function generateResponse(message) {
    const openaiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';
    const prompt = `한국어로 대화하기\n사용자: ${message}\n${chatbotRole}: `;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  };

  const data = {
    prompt: prompt,
    max_tokens: 300,
    n: 1,
    stop: null,
    temperature: 1,
  };

  const response = await axios.post(openaiUrl, data, config);
  console.log(`response is : ${response}`);
  return response.data.choices[0].text.trim();
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  console.error(`Error starting the server: ${err}`);
});
