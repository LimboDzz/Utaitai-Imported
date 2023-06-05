const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	key: { type: String, required: true },
	url: { type: String, required: true },
	name: { type: String, required: true },
	author: { type: String, default: 'Unknown' },
	size: { type: Number },
	createAt: { type: Date, required: true, default: Date.now },
	tags: [String],
	lyrics: [{ timestamp: Number, content: String }],
	offset: { type: Number, default: 0 },
});
