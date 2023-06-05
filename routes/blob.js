const multer = require('multer');
const express = require('express');
const router = express.Router();
module.exports = router;

const {
	createOneBlob,
	deleteOneBlob,
	getOneBlob,
} = require('../controllers/blobController');

const storage = multer.memoryStorage();
const upload = multer({ storage });
router.use(express.json());

router.post('/', upload.single('file'), createOneBlob);
router.get('/:key', getOneBlob);
router.delete('/', deleteOneBlob);
