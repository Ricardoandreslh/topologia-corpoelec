const express = require('express');
const multer = require('multer');
const path = require('path'); 
const { uploadImage, getImage, deleteImage } = require('../controllers/imagesController');
const { apiLimiter } = require('../middleware/rateLimiters');


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB límite

router.post('/', apiLimiter, upload.single('image'), uploadImage);
router.get('/:id', apiLimiter, getImage);
router.delete('/:id', apiLimiter, deleteImage);

module.exports = router;
