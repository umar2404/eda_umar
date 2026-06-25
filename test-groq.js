const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const keyMatch = env.match(/GROQ_API_KEY="([^"]+)"/);
if (keyMatch) process.env.GROQ_API_KEY = keyMatch[1];

const Groq = require('./node_modules/groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function test() {
  try {
    const models = await groq.models.list();
    console.log("✅ API Key is working! Available models count:", models.data.length);
    
    const targetModel = "meta-llama/llama-4-scout-17b-16e-instruct";
    const modelExists = models.data.some(m => m.id === targetModel);
    console.log("Model 'meta-llama/llama-4-scout-17b-16e-instruct' exists:", modelExists);
    
    // Also check for vision models
    const visionModels = models.data.filter(m => m.id.includes('vision')).map(m => m.id);
    console.log("Vision models available:", visionModels);

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

test();
