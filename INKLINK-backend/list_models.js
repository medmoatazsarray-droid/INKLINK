const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenerativeAI(apiKey);
  
  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
    "gemini-pro"
  ];
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying model: ${modelName}...`);
      const model = ai.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      console.log(`SUCCESS for ${modelName}:`, result.response.text());
      return; // Stop at first successful model
    } catch (err) {
      console.error(`FAILED for ${modelName}:`, err.message);
    }
  }
}

testModels();
