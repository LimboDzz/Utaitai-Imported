const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');

const app = express();
const port = 3000;

// Multer middleware
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Azure Storage connection string
const connectionString =
	'DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net';

// Upload route
app.post('/upload', upload.single('file'), async (req, res) => {
	try {
		// Create BlobServiceClient object
		const blobServiceClient =
			BlobServiceClient.fromConnectionString(connectionString);

		// Get a reference to a container
		const containerClient =
			blobServiceClient.getContainerClient('<container-name>');

		// Get a block blob client
		const blockBlobClient = containerClient.getBlockBlobClient(
			req.file.originalname
		);

		// Upload file to block blob
		const data = req.file.buffer;
		const uploadBlobResponse = await blockBlobClient.upload(data, data.length);

		res.send(`File uploaded successfully. Blob URL: ${blockBlobClient.url}`);
	} catch (error) {
		console.log(error);
		res.status(500).send(error.message);
	}
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
