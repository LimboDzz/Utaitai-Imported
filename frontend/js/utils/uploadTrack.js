import Toast from './Toast.js'


/**
 * Upload single file to S3
 * @param {File} file 
 * @return a Promise to resolve {key: "objectKey in S3 Bucket"}
 */
export default async function (file) {
    const name = file.name.split('.')[0]
    // ?create and insert .uploading
    const uploading = document.createElement('track-li-uploading')
    uploading.name = name
    const dndUploadTrack = document.querySelector('#dndUploadTrack')
    dndUploadTrack.insertBefore(uploading, dndUploadTrack.firstElementChild)
    // ?upload to S3
    const fd = new FormData();
    fd.append('file', file)
    let res
    try {
        res = await fetch("/aws", {
            method: "post",
            body: fd
        })
    } catch (error) {
        Toast.send(error.message, "failure")
    }
    const { key, msg } = await res.json()
    if (msg) {
        Toast.send(msg, 'failure')
        return
    }
    // ?updateElement
    const track = document.createElement('track-li')
    track.setAttribute('key', key)
    track.setAttribute('name', name)
    track.setAttribute('author', "Unknown")
    track.tags = []
    uploading.replaceWith(track)
}