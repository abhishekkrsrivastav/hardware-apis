const express = require('express');
const router = express.Router();
const imageChunkController = require('../controllers/imageChunkController');

 
router.post(
  '/upload-image-chunk',
 express.raw({ type: '*/*', limit: '50mb' }),
  imageChunkController.uploadImageChunk
);

module.exports = router;
