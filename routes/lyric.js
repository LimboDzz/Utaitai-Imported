const multer = require('multer');
const express = require('express');
const router = express.Router();
module.exports = router;
const {
	createOneLyric,
	getOneLyric,
	updateOneLyric,
} = require('../controllers/lyricController');

// ?enable req.file.buffer using memoryStorage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('file'), createOneLyric);
router.get('/:key', getOneLyric);
router.patch('/:key', updateOneLyric);
