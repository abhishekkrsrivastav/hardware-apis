 

const express = require('express');
const multer = require('multer');
const path = require('path');
const cors  = require('cors');
const fs = require('fs');
 const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath);
}

// Serve uploads folder as static
app.use('/uploads', express.static(uploadPath));

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Upload route
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const baseUrl = req.protocol + '://' + req.get('host');
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  res.json({ message: 'Image uploaded', url: imageUrl,data: req.body });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const express = require('express');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Ensure folders exist
// const uploadPath = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

// const mediaPath = path.join(__dirname, 'media');
// if (!fs.existsSync(mediaPath)) fs.mkdirSync(mediaPath);

// // Static serving
// app.use('/uploads', express.static(uploadPath));
// app.use('/media', express.static(mediaPath));

// // Routes
// const normalUploadRoutes = require('./routes/normalUploadRoutes');
// const chunkedUploadRoutes = require('./routes/chunkedUploadRoutes');

// app.use('', normalUploadRoutes);         
// app.use('', chunkedUploadRoutes);       

// const PORT = process.env.PORT || 3333;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
