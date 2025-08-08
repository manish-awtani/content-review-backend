// content-service/src/controllers/moderationController.js
const Content = require('../models/Content');

exports.approveContent = async (req, res) => {
  try {
    const contentId = req.params.id;
    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json({ message: 'Not found' });

    content.status = 'approved';
    await content.save();

    return res.json({ message: 'Content approved', content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.rejectContent = async (req, res) => {
  try {
    const contentId = req.params.id;
    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json({ message: 'Not found' });

    content.status = 'rejected';
    await content.save();

    return res.json({ message: 'Content rejected', content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
