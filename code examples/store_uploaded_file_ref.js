const mongoose = require('mongoose');

// Define a schema for your data
const songSchema = new mongoose.Schema({
	title: String,
	artist: String,
	album: String,
	year: Number,
	duration: Number,
	url: String,
});

// Define a model for your data
const Song = mongoose.model('Song', songSchema);

// Upload route
app.post('/upload', upload.array('files'), async (req, res) => {
	// Save the uploaded files to Azure Blob Storage
	const urls = await Promise.all(
		req.files.map(async file => {
			const blobName = `${uuidv4()}.${file.originalname.split('.').pop()}`;
			const blockBlobClient = containerClient.getBlockBlobClient(blobName);
			await blockBlobClient.uploadStream(file.stream);
			return blockBlobClient.url;
		})
	);

	// Create a new song document for each uploaded file
	const songs = urls.map(url => new Song({ url }));

	// Save the song documents to MongoDB
	await Song.insertMany(songs);

	res.send('Files uploaded successfully!');
});
