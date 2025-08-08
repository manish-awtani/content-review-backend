// index.js of apps/moderation-worker/src/worker.js
require('dotenv').config();
const mongoose = require('mongoose');
const { Worker } = require('bullmq');
const { connection } = require('../../../libs/queues/moderationQueue'); // reuse libs connection
const Content = require('../../content-service/src/models/Content'); // path depends on your setup
const { OpenAIApi, Configuration } = require('openai');

// connect to Mongo
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Worker connected to MongoDB'))
  .catch(err => { console.error('Mongo connect error', err); process.exit(1); });

// configure OpenAI
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

const worker = new Worker('moderation-queue', async job => {
  console.log('Processing job', job.id, job.name, job.data);

  const { contentId } = job.data;
  const content = await Content.findById(contentId);
  if (!content) throw new Error('Content not found: ' + contentId);

  // Example prompt - keep it simple, refine as you iterate
  const prompt = `
You are a content moderation assistant. Analyze the following content and return a JSON with keys:
- toxicityScore: number (0 to 1)
- spamScore: number (0 to 1)
- sentiment: "positive"|"neutral"|"negative"
Explain briefly as reason.

Content:
${content.title || ''}

${content.body || ''}
`;

  // Call OpenAI - use a short, cheap completion or moderation API if available
  const response = await openai.createChatCompletion({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini', // or 'gpt-4o', 'gpt-3.5-turbo' as per access
    messages: [{ role: 'system', content: 'You are an accurate moderation assistant.'}, { role: 'user', content: prompt }],
    max_tokens: 300,
    temperature: 0
  });

  const raw = response?.data?.choices?.[0]?.message?.content || '';
  // Try to extract JSON from raw text
  let parsed = {};
  try {
    // If model returns JSON, parse it. If not, fallback to naive extraction.
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonStr = raw.slice(jsonStart, jsonEnd + 1);
      parsed = JSON.parse(jsonStr);
    } else {
      // fallback: simple rules
      parsed = {
        toxicityScore: raw.includes('toxic') ? 0.9 : 0.0,
        spamScore: raw.includes('spam') ? 0.8 : 0.0,
        sentiment: raw.includes('negative') ? 'negative' : 'neutral'
      };
    }
  } catch (err) {
    console.warn('Failed to parse model output, using fallback', err);
    parsed = {
      toxicityScore: 0,
      spamScore: 0,
      sentiment: 'neutral'
    };
  }

  // Decide status
  const threshold = parseFloat(process.env.TOXICITY_THRESHOLD || '0.6');
  const flagged = (parsed.toxicityScore || 0) >= threshold || (parsed.spamScore || 0) >= 0.7;
  const newStatus = flagged ? 'flagged_by_ai' : 'pending';

  // Update content doc
  content.aiFeedback = {
    sentiment: parsed.sentiment || 'neutral',
    toxicityScore: parsed.toxicityScore || 0,
    spamScore: parsed.spamScore || 0
  };
  content.status = newStatus;
  await content.save();

  console.log(`Job ${job.id} complete. Status set to ${newStatus}.`);
}, { connection });

// worker event listeners
worker.on('failed', (job, err) => {
  console.error('Job failed', job.id, err);
});

worker.on('completed', job => {
  console.log('Job completed', job.id);
});
