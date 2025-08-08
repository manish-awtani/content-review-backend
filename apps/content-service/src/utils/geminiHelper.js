// content-service/src/utils/geminiHelper.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeContentWithGemini = async (title, body) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Analyze the following user-generated content for:
      1. Sentiment (positive, neutral, negative)
      2. Toxicity score (0 to 1, where 1 is highly toxic)
      3. Spam score (0 to 1, where 1 is highly spammy)
      
      Content Title: ${title}
      Content Body: ${body || ""}
      
      Respond in JSON format:
      {
        "sentiment": "...",
        "toxicityScore": ...,
        "spamScore": ...
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return JSON.parse(text);
  } catch (err) {
    console.error("❌ Gemini Analysis Error:", err);
    return {
      sentiment: "neutral",
      toxicityScore: 0,
      spamScore: 0
    };
  }
};
