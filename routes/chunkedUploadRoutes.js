const express = require('express');
const ChunkedUpload = require('@rstcruzo/express-chunked-file-upload');
const chunkedUploadController = require('../controllers/chunkedUploadController');

const router = express.Router();
const chunkedUpload = new ChunkedUpload({ filePath: 'media/' });

router.post('/upload-chunked', chunkedUpload.makeMiddleware(), chunkedUploadController.chunkedUpload);

module.exports = router;
