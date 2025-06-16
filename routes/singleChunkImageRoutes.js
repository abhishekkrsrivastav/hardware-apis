const express = require('express');
const router = express.Router();
const singleChunkImageController = require('../controllers/singleChunkImageController');

 
router.post(
  '/upload-single-image-chunk',
  express.raw({ type: '*/*', limit: '50mb' }),  
  singleChunkImageController.uploadSingleImageChunk
);

module.exports = router;
