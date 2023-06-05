import Toast from './Toast.js';

/**
 * Upload single file to Azure
 * @param {File} file
 * @return a Promise to resolve {url: "url for blob"}
 */
export default async function (file) {
	const fiilename = file.name.split('.')[0];
	// ?create and insert .uploading
	const uploading = document.createElement('track-li-uploading');
	uploading.name = fiilename;
	const dndUploadTrack = document.querySelector('#dndUploadTrack');
	dndUploadTrack.insertBefore(uploading, dndUploadTrack.firstElementChild);
	// ?upload to S3
	const fd = new FormData();
	fd.append('file', file);
	let res;
	try {
		res = await fetch('/blob', {
			method: 'post',
			body: fd,
		});
	} catch (error) {
		Toast.send(error.message, 'failure');
	}
	const { url, key, msg, name } = await res.json();
	if (msg) {
		Toast.send(msg, 'failure');
		return;
	}
	// ?updateElement
	const track = document.createElement('track-li');
	track.setAttribute('url', url);
	track.setAttribute('key', key);
	track.setAttribute('name', name);
	track.setAttribute('author', 'Unknown');
	track.tags = [];
	uploading.replaceWith(track);
}
