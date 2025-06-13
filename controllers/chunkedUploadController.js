exports.chunkedUpload = (req, res) => {
  if (req.filePart === 0) {
    // Optionally log or track progress
  }
  if (req.isLastPart) {
    const fileUrl = `${req.protocol}://${req.get('host')}/media/${req.fileName}`;
    return res.json({ message: 'Image uploaded', url: fileUrl });
  }
  res.json({ message: 'Chunk received' });
};
