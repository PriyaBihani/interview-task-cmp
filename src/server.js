require("dotenv").config();
const express = require("express");
const axios = require("axios");
const OpenAI = require("openai");
const getTextForIntent = require("./minify");

const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});
axios
  .get("https://github.com/kaavee315")
  .then(async (response) => {
    const text = getTextForIntent(response.data);
    // Send the text to the LLM
    const gptResponse = await openai.completions.create({
      model: "gpt-3.5-turbo",
      prompt: text,
    });
    // Interpret the response
    const intent = gptResponse.choices[0].text.trim();
    console.log(intent);
  })
  .catch((error) => {
    console.error(error);
  });

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
