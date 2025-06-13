const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const normalUploadController = require('../controllers/normalUploadController');

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

router.post('/upload', upload.single('image'), normalUploadController.uploadImage);

module.exports = router;
