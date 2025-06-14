const express = require('express');
const router = express.Router();
const imageChunkController = require('../controllers/imageChunkController');

// Raw parser middleware for image chunks
router.post(
  '/upload-image-chunk',
 express.raw({ type: '*/*', limit: '50mb' }),
  imageChunkController.uploadImageChunk
);

module.exports = router;
