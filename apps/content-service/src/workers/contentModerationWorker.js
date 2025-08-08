// content-service/src/workers/contentModerationWorker.js
const { Worker } = require("bullmq");
const redis = require("../../../../libs/database/redis");
const Content = require("../models/Content");
const { analyzeContentWithGemini } = require("../utils/geminiHelper");

const worker = new Worker(
  "contentModerationQueue",
  async (job) => {
    const { contentId } = job.data;
    console.log(`🚀 Moderating content: ${contentId}`);

    const content = await Content.findById(contentId);
    if (!content) {
      console.warn(`⚠️ Content not found for moderation: ${contentId}`);
      return;
    }

    // Call Gemini AI
    const aiFeedback = await analyzeContentWithGemini(content.title, content.body);

    // Decide status based on AI analysis
    let status = "approved";
    if (aiFeedback.toxicityScore > 0.7 || aiFeedback.spamScore > 0.7) {
      status = "flagged_by_ai";
    }

    content.aiFeedback = aiFeedback;
    content.status = status;
    await content.save();

    console.log(`✅ Moderation complete for ${contentId}, Status: ${status}`);
  },
  { connection: redis.options }
);

worker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err);
});
