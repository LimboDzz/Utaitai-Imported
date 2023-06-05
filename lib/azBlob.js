async file => {
	const blobName = `${uuidv4()}.${file.originalname.split('.').pop()}`;
	const blockBlobClient = containerClient.getBlockBlobClient(blobName);
	await blockBlobClient.uploadStream(file.stream);
	return blockBlobClient.url;
};
