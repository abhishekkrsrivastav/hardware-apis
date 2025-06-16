const fs = require('fs');
const path = require('path');


const uploadPath = path.join(__dirname, '..', 'uploads');
const tempPath = path.join(__dirname, '..', 'temp');

exports.uploadSingleImageChunk = async (req, res) => {
  const fileId = req.headers['image_name'];
  const chunkIndex = parseInt(req.headers['x-chunk-index'], 10);
  const totalChunks = parseInt(req.headers['x-total-chunks'], 10);
  const isLastChunk = chunkIndex === totalChunks - 1;

  if (!fileId || isNaN(chunkIndex) || isNaN(totalChunks) || !req.body || !req.body.length) {
    return res.status(400).json({ error: 'Missing headers or image data' });
  }


  const tempFile = path.join(tempPath, `${fileId}.part`);


  fs.appendFileSync(tempFile, req.body);


  if (!isLastChunk) {
    return res.json({ message: 'Chunk received', chunkIndex });
  }


  const finalFilename = `${fileId}_${Date.now()}.jpg`;
  const finalFilePath = path.join(uploadPath, finalFilename);


  fs.renameSync(tempFile, finalFilePath);

  const baseUrl = req.protocol + '://' + req.get('host');
  const imageUrl = `${baseUrl}/uploads/${finalFilename}`;
  return res.json({ message: 'Image uploaded', url: imageUrl });


};
