const Content = require('../models/Content');

exports.saveContent = async ({ title, body, media, userId }) => {
  const content = new Content({
    title,
    body,
    media,
    // userId,
    createdBy,
  });

  const savedContent = await content.save();

  // Push to BullMQ for AI moderation
  await contentModerationQueue.add("moderateContent", { contentId: savedContent._id });

  return savedContent;
};
