const { Queue } = require("bullmq");
const redis = require("../../../../libs/database/redis");

const contentModerationQueue = new Queue("contentModerationQueue", {
  connection: redis,
});

module.exports = contentModerationQueue;
