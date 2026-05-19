const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenerativeAI(apiKey);
  try {
    const model = ai.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent("hello");
    console.log("SUCCESS Response:", result.response.text());
  } catch (err) {
    console.error("FAILED:", err.message);
  }
}
test();
