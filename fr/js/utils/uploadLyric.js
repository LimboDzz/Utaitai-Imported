import Toast from './Toast.js'
import fillLyrics from './fillLyrics.js'




/**
 * Upload lyric and update view
 * @param {File} file .lrc file
 * @param {String} key the playing track key to find a attach lrc to 
 * @return a Promise to resolve {key: "objectKey in S3 Bucket"}
 */
export default async function (file, trackLi) {
    const key = trackLi.key
    // ?upload to S3
    const fd = new FormData();
    fd.append('file', file)
    fd.append('key', key)
    let res
    try {
        res = await fetch("/lyric", {
            method: "post",
            body: fd
        })
    } catch (error) {
        Toast.send("err: fail to post lyric", "failure")
    }
    const { lyrics, offset, msg } = await res.json()
    if (msg) {
        Toast.send(msg, 'failure')
        return
    }
    // ?update view
    fillLyrics(lyrics, offset)
}