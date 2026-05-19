const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Using API Key:", apiKey);
  try {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: "You are InkLink AI assistant helping users with branding, tshirts, printing, logos, artists, posters, and product descriptions. Keep your responses extremely concise and to the point (maximum 2-3 short sentences). Avoid long paragraphs."
    });
    const result = await model.generateContent("hello");
    console.log("SUCCESS:", result.response.text());
  } catch (err) {
    console.error("ERROR STACK:", err);
  }
}
run();
