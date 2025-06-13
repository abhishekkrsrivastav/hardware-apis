const path = require('path');

exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const baseUrl = req.protocol + '://' + req.get('host');
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  res.json({ message: 'Image uploaded', url: imageUrl });
};
