const Content = require('../models/Content');

exports.saveContent = async ({ title, body, media, userId }) => {
  const content = new Content({
    title,
    body,
    media,
    createdBy: userId,
  });

  return await content.save();
};
