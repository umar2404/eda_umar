import fs from 'fs/promises';
import Groq from 'groq-sdk';

async function readEnvKey() {
  try {
    const env = await fs.readFile(new URL('../.env', import.meta.url));
    const match = env.toString().match(/^GROQ_API_KEY=(?:"|')?([^"'\n]+)(?:"|')?/m);
    return match ? match[1] : process.env.GROQ_API_KEY;
  } catch (e) {
    return process.env.GROQ_API_KEY;
  }
}

const key = await readEnvKey();
if (!key) {
  console.error('GROQ_API_KEY not found in .env or environment');
  process.exit(1);
}

const groq = new Groq({ apiKey: key });

try {
  const res = await groq.models.list();
  console.log('Models response:', JSON.stringify(res, null, 2));
} catch (err) {
  console.error('Models error:', err);
  process.exit(2);
}
