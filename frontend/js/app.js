import manufactureDOMs from './utils/manufactureDOMs.js'
import Toast from './utils/toast.js'
import TrackEditMask from '../components/TrackEditMask.js'
import TrackLi from '../components/TrackLi.js'
import TrackLiUploading from '../components/TrackLiUploading.js'
import uploadTrack from './utils/uploadTrack.js'
import uploadLyric from './utils/uploadLyric.js'
import bindCtrls from './utils/bindCtrls.js'
import SearchBar from '../components/SearchBar.js'
import NoteLi from '../components/NoteLi.js'
import toggleWordSave from './utils/toggleWordSave.js'
import uploadNote from './utils/uploadNote.js'
import query from './API/query.js'
import detect from './API/detectLanguage.js'



const { wrapper, logo, funcsAside, toDndUploadTrack, toNoteList, toSettings, progressBar, panelList, selectSearch, dndUploadTrack, currentTrackInfo, panelLyrics, dndUploadLyrics, audioPlayerCtrl, basicCtrl, singleSongLoop, pause, play, volume, altCtrl, lineFollow, singleLineLoop, lineOffset, offsetMinus, offsetPlus, queryPopup, queryCtrl, queryCheck, queryAdd, queryClose, noteList, audioPlayer, noteHead, noteBody } = manufactureDOMs()



defineCustomElements()
initAudioPlayer()
loadTrackList()
loadNoteList()
listenDndUploadTrack()
listenDndUploadLyrics()
listenAside()
listenQueryPopup()
listenSelection()

// todo need reconstruct
bindCtrls()


function defineCustomElements() {
    customElements.define('track-edit-mask', TrackEditMask)
    customElements.define('track-li', TrackLi)
    customElements.define('track-li-uploading', TrackLiUploading)
    customElements.define('search-bar', SearchBar)
    customElements.define('note-li', NoteLi)
}
function listenDndUploadLyrics() {
    //#region drag events
    dndUploadLyrics.addEventListener('dragover', function (e) {
        e.preventDefault()
    })
    dndUploadLyrics.addEventListener('drop', function (e) {
        e.preventDefault()

        // !get dropped files
        const file = e.dataTransfer.files[0]
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
function listenDndUploadTrack() {
    //#region drag events
    dndUploadTrack.addEventListener('dragover', function (e) {
        e.preventDefault()
        dndUploadTrack.classList.add("active")
    })
    dndUploadTrack.addEventListener('dragleave', function (e) {
        dndUploadTrack.classList.remove("active")
    })
    dndUploadTrack.addEventListener('drop', function (e) {
        e.preventDefault()
        dndUploadTrack.classList.remove("active")

        // !get dropped files
        const files = e.dataTransfer.files
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
    // ?get all tracks
    let res, tracks
    try {
        res = await fetch('/track')
        tracks = await res.json()
    } catch (error) {
        Toast.send(error.message, 'failure')
        return
    }
    // ?create and insert trackLi
    for (let track of tracks) {
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
async function loadNoteList() {
    // ?get all notes
    let res, notes
    try {
        res = await fetch('/note')
        notes = await res.json()
    } catch (error) {
        Toast.send(error.message, 'failure')
    }
    // ?create and insert note
    for (let note of notes) {
        const noteLi = document.createElement('note-li')
        noteLi.head = note.head
        noteLi.body = note.body
        noteLi._id = note._id
        noteLi.createAt = note.createAt
        noteList.appendChild(noteLi)
    }
}
async function initAudioPlayer() {
    // ?get settings
    let res, settings
    try {
        res = await fetch('/settings')
        settings = await res.json()
    } catch (error) {
        Toast.send(error.message, 'failure')
    }
    // ?apply settings
    const { volume, loop, autoplay, lineFollow, offset, singleLineLoop } = settings
    audioPlayer.volume = volume ?? 0.1
    audioPlayer.loop = loop ?? false
    audioPlayer.autoplay = autoplay ?? false
    audioPlayer.lineFollow = lineFollow ?? true
    audioPlayer.singleLineLoop = singleLineLoop ?? false
    audioPlayer.offset = offset ?? 0
    initPlayerCtrls()
}
function initPlayerCtrls() {
    volume.value = audioPlayer.volume
    singleSongLoop.classList.toggle('enabled', audioPlayer.loop)
    lineFollow.classList.toggle('enabled', audioPlayer.lineFollow)
    singleLineLoop.classList.toggle('enabled', audioPlayer.singleLineLoop)
}
function listenAside() {
    toDndUploadTrack.addEventListener('click', function () {
        dndUploadTrack.classList.remove('hidden')
        noteList.classList.add('hidden')
    })
    toNoteList.addEventListener('click', function () {
        dndUploadTrack.classList.add('hidden')
        noteList.classList.remove('hidden')
    })
}
function listenQueryPopup() {
    queryAdd.addEventListener('click', function () {
        toggleWordSave(true)
        uploadNote(noteHead.textContent, noteBody.textContent)
    })
    queryClose.addEventListener('click', function () {
        toggleWordSave(false)
        queryPopup.classList.remove('popup')
    })
}
function listenSelection() {
    dndUploadLyrics.addEventListener('mouseup', async function () {
        const selection = getSelection().toString()
        if (!selection) {
            window.selecting = false
            return
        }
        // ?prevent click event
        window.selecting = true
        // ?render queryPopup
        noteHead.textContent = selection
        // ?(eng(en)|jpn(ja)|other)detect language from selection
        const lang = await detect(selection)
        if (lang == "other") return
        // todo use better queryAPI
        noteBody.textContent = await query(selection, lang)
        toggleWordSave(false)
        queryPopup.classList.add('popup')
    })
}

// todo queryPopup CSS
// todo (mimic MOJI and figma first) toSettings
// todo bind hotkeys