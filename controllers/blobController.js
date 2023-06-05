const { BlobServiceClient } = require('@azure/storage-blob');

const {
	BLOB_URI: blobUri,
	AZURE_STORAGE_CONNECTION_STRING: connectionString,
	CONTAINER_NAME: containerName,
} = process.env;

const blobServiceClient =
	BlobServiceClient.fromConnectionString(connectionString);

const createOneBlob = async (req, res) => {
	try {
		// ?Upload file to block blob
		const containerClient = await createContainerIfNotExists();
		const blockBlobClient = containerClient.getBlockBlobClient(
			req.file.originalname
		);
		console.log(`Trying to upload ${req.file.originalname}`);
		const data = req.file.buffer;
		await blockBlobClient.uploadData(data);
		req.file.url = blockBlobClient.url;
		console.log(`File uploaded successfully. Blob URL: ${blockBlobClient.url}`);
		// ?save track to DB
		const track = {
			name: req.file.originalname,
			size: req.file.size,
			url: req.file.url,
			key: req.file.originalname.split('.')[0],
		};
		await addTrack(req.user, track);
		// ?return url and name(lyricsKey)
		res.json(track);
	} catch (error) {
		res.json({ msg: error.message });
	}
};
// should never be used
const getOneBlob = (req, res) => {
	const key = req.params.key;
	const readStream = downloadFromS3(key);
	readStream.pipe(res);
};
const deleteOneBlob = async (req, res) => {
	const { name: blobName, key } = req.body;
	console.log(`Trying to delete ${blobName}`);
	try {
		deleteTrackByKey(req.user, key);
		const containerClient = await createContainerIfNotExists();
		deleteBlob(containerClient, blobName);
		res.json({});
	} catch (error) {
		res.json({ msg: 'err: Fail to delete. ' + error.message });
	}
};

module.exports = {
	createOneBlob,
	deleteOneBlob,
	getOneBlob,
};

/**
 * add track to this user's trackList
 * @param {User} user
 * @param {Object} track
 */
async function addTrack(user, track) {
	try {
		user.trackList.push(track);
		await user.save();
		console.log(`add track: ${track.name}`);
	} catch (error) {
		console.trace(error.message);
	}
}

/**
 * delete track from this user's trackList
 * @param {User} user
 * @param {String} trackKey
 */
async function deleteTrackByKey(user, key) {
	try {
		user.trackList = user.trackList.filter(track => track.key != key);
		user.save();
		console.log(`delete track: ${track.name}`);
	} catch (error) {
		console.trace(error.message);
	}
}

/**
 * Create a new container in Azure Blob Storage if it doesn't exist
 */
async function createContainerIfNotExists() {
	const containerClient = blobServiceClient.getContainerClient(containerName);
	const exists = await containerClient.exists();
	if (!exists) {
		await containerClient.create();
	}
	return containerClient;
}
async function deleteBlob(containerClient, blobName) {
	// include: Delete the base blob and all of its snapshots.
	// only: Delete only the blob's snapshots and not the blob itself.
	const options = {
		deleteSnapshots: 'include', // or 'only'
	};
	// Create blob client from container client
	const blockBlobClient = await containerClient.getBlockBlobClient(blobName);
	await blockBlobClient.delete(options);
	console.log(`deleted blob ${blobName}`);
}
