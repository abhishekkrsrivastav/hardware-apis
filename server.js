 

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
 

const app = express();
app.use(cors());

express.raw()
 

const uploadPath = path.join(__dirname, 'uploads');
const tempPath = path.join(__dirname, 'temp');
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);

app.use('/upload-image', express.raw({ type: ['image/jpeg', 'image/png', 'image/jpg'] }));

const imageChunkRoutes = require('./routes/imageChunkRoutes');
app.use('/', imageChunkRoutes);

const singleChunkImageRoutes = require('./routes/singleChunkImageRoutes');
app.use('/', singleChunkImageRoutes);


app.post('/upload-image', (req, res) => {
  if (!req.body || !req.body.length) {
    return res.status(400).json({ error: 'No image data received' });
  }
  const filename = Date.now() + '.jpg';
  const filepath = path.join(uploadPath, filename);


  fs.writeFileSync(filepath, req.body);

  const baseUrl = req.protocol + '://' + req.get('host');
  const imageUrl = `${baseUrl}/uploads/${filename}`;

  res.json({ message: 'Image uploaded', url: imageUrl });
});


app.use('/uploads', express.static(uploadPath));

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));