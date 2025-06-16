 
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadPath = path.join(__dirname, '..', 'uploads');
const tempPath = path.join(__dirname, '..', 'temp');

exports.uploadImageChunk = async (req, res) => {
  const totalImages = parseInt(req.headers['x-total-images'], 10);
  const imageIndex = parseInt(req.headers['x-image-index'], 10);

  if (!totalImages || !imageIndex || !req.body || !req.body.length) {
    return res.status(400).json({ error: 'Missing headers or image data' });
  }

 
  const tempFile = path.join(tempPath, `img_${imageIndex}.jpg`);
  fs.writeFileSync(tempFile, req.body);

 
  if (imageIndex < totalImages) {
    return res.json({ message: 'Chunk received', index: imageIndex });
  }

 
  try {
 
    const images = [];
    for (let i = 1; i <= totalImages; i++) {
      images.push({ input: fs.readFileSync(path.join(tempPath, `img_${i}.jpg`)) });
    }

    
    let combined = sharp(images[0].input);
    for (let i = 1; i < images.length; i++) {
      const nextImg = sharp(images[i].input);
      const { width, height } = await combined.metadata();
      const nextMeta = await nextImg.metadata();

 
      const newHeight = height + nextMeta.height;
      const newImg = await sharp({
        create: {
          width: Math.max(width, nextMeta.width),
          height: newHeight,
          channels: 3,
          background: { r: 255, g: 255, b: 255 }
        }
      })
        .composite([
          { input: await combined.toBuffer(), top: 0, left: 0 },
          { input: images[i].input, top: height, left: 0 }
        ])
        .png()
        .toBuffer();
      combined = sharp(newImg);
    }

    const finalImage = await combined.png().toBuffer();
    const finalFilename = `combined_${Date.now()}.png`;
    const finalFilePath = path.join(uploadPath, finalFilename);
    fs.writeFileSync(finalFilePath, finalImage);

 
    for (let i = 1; i <= totalImages; i++) {
      fs.unlinkSync(path.join(tempPath, `img_${i}.jpg`));
    }

    const baseUrl = req.protocol + '://' + req.get('host');
    const imageUrl = `${baseUrl}/uploads/${finalFilename}`;
    return res.json({ message: 'All chunks received', url: imageUrl });

  } catch (err) {
    console.error('Error combining images:', err);
    return res.status(500).json({ error: 'Failed to combine images' });
  }
};
