const contentService = require('../services/contentService');

exports.uploadContent = async (req, res) => {
  try {
    const { title, body, media } = req.body;
    const userId = req.user.id; // extracted from authMiddleware

    const content = await contentService.saveContent({ title, body, media, userId });

    res.status(201).json({ message: 'Content uploaded successfully', content });
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error);
    res.status(500).json({ message: 'Failed to upload content' });
  }
};
