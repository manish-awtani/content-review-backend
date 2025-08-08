// // libs/queues/moderationQueue.js
// const { Queue } = require('bullmq');
// const redis = require("../database/redis");

// const connection = new IORedis({
//   host: process.env.REDIS_HOST || '127.0.0.1',
//   port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
// });

// const moderationQueue = new Queue('moderation-queue', { connection });

// module.exports = { moderationQueue, connection };
