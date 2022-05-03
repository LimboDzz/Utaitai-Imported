import Toast from './utils/toast.js'
import TrackEditMask from '../components/TrackEditMask.js'
import TrackLi from '../components/TrackLi.js'
import TrackLiUploading from '../components/TrackLiUploading.js'
import uploadTrack from './utils/uploadTrack.js'
import uploadLyric from './utils/uploadLyric.js'
import bindCtrls from './utils/bindCtrls.js'
import SearchBar from '../components/SearchBar.js'




Toast.init()
registerCustomElements()
initAudioPlayer()
loadTrackList()
dndUploadTrack()
dndUploadLyric()
bindCtrls()


function registerCustomElements() {
    customElements.define('track-edit-mask', TrackEditMask)
    customElements.define('track-li', TrackLi)
    customElements.define('track-li-uploading', TrackLiUploading)
    customElements.define('search-bar', SearchBar)
}
function dndUploadLyric() {
    let file = undefined;
    const dragArea = document.querySelector("#dndUploadLyric")

    //#region drag events
    dragArea.addEventListener('dragover', function (e) {
        e.preventDefault()
    })
    dragArea.addEventListener('drop', function (e) {
        e.preventDefault()

        // DataTransfer.files
        file = e.dataTransfer.files[0]
        // !check type
        if (!/lrc$/.test(file.name)) {
            Toast.send('Err: Drops should be .lrc files.', 'alert')
            return
        }
        // !check the corresponding trackLi
        const trackLi = [...document.querySelectorAll('track-li')].find(trackLi => trackLi.playing == "true")
        if (!trackLi) {
            Toast.send("You need to select a track first.", "alert")
            return
        }
        // !upload and save
        uploadLyric(file, trackLi)
    })
    //#endregion
}
function dndUploadTrack() {
    let files = undefined;
    const dragArea = document.querySelector("#dndUploadTrack")

    //#region drag events
    dragArea.addEventListener('dragover', function (e) {
        e.preventDefault()
        dragArea.classList.add("active")
    })
    dragArea.addEventListener('dragleave', function (e) {
        dragArea.classList.remove("active")
    })
    dragArea.addEventListener('drop', function (e) {
        e.preventDefault()
        dragArea.classList.remove("active")

        // DataTransfer.files
        files = e.dataTransfer.files
        const fileList = Array.from(files)
        // !check type
        if (!fileList.every(file => /^audio/.test(file.type))) {
            Toast.send('Err: Drops should be audio files.', 'alert')
            return
        }
        // !upload and save
        fileList.forEach(file => uploadTrack(file))
    })
    //#endregion
}
async function loadTrackList() {
    const dndUploadTrack = document.querySelector('#dndUploadTrack')
    const res = await fetch('/track')
    const trackList = await res.json()
    for (let track of trackList) {
        const trackLi = document.createElement('track-li')
        trackLi.key = track.key
        trackLi.name = track.name
        trackLi.author = track.author
        trackLi.size = track.size
        trackLi.createAt = track.createAt
        trackLi.lyrics = track.lyrics
        trackLi.tags = track.tags
        trackLi.offset = track.offset
        dndUploadTrack.appendChild(trackLi)
    }
}
async function initAudioPlayer() {
    const audioPlayer = document.createElement('audio')
    audioPlayer.id = "audioPlayer"
    document.body.appendChild(audioPlayer)

    const res = await fetch('/settings')
    const { volume, loop, autoplay, lyricFollow, offset } = await res.json()
    // ?A double values must fall between 0 and 1, where 0 is effectively muted and 1 is the loudest possible value. 
    audioPlayer.volume = volume ?? .2
    audioPlayer.loop = loop ?? false
    audioPlayer.autoplay = autoplay ?? false
    audioPlayer.lyricFollow = lyricFollow ?? true
    audioPlayer.singleLineLoop = false
    audioPlayer.offset = offset
}
