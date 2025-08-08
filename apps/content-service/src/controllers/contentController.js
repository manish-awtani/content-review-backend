const contentService = require('../services/contentService');
const { moderationQueue } = require('../../../libs/queues/moderationQueue');


exports.uploadContent = async (req, res) => {
  try {
    const { title, body, media } = req.body;
    const userId = req.user.id; // extracted from authMiddleware

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const content = await contentService.saveContent({
      title,
      body,
      media,
      // userId, // for other service logic
      createdBy: userId // for database storage
    });

    // enqueue moderation job (job data: contentId)
    await moderationQueue.add('ai-moderate', { contentId: content._id }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    });
    
    res.status(201).json({ message: 'Content uploaded successfully', content });
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error);
    res.status(500).json({ message: 'Failed to upload content' });
  }
};

exports.approveContent = async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.json({ message: "Content approved", content });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve content" });
  }
};

exports.rejectContent = async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    res.json({ message: "Content rejected", content });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject content" });
  }
};
