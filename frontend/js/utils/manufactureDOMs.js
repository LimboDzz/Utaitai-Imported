export default function () {
    const DOMs = {}
    const idList = ['wrapper', 'logo', 'funcsAside', 'toDndUploadTrack', 'toNoteList', 'toSettings', 'progressBar', 'panelList', 'selectSearch', 'dndUploadTrack', 'currentTrackInfo', 'panelLyrics', 'dndUploadLyrics', 'audioPlayerCtrl', 'basicCtrl', 'singleSongLoop', 'pause', 'play', 'volume', 'altCtrl', 'lineFollow', 'singleLineLoop', 'lineOffset', 'offsetMinus', 'offsetPlus', 'queryPopup', 'queryCtrl', 'queryCheck', 'queryAdd', 'queryClose', 'toastContainer', 'noteList', 'audioPlayer', 'noteHead', 'noteBody']
    idList.forEach(id => {
        DOMs[id] = document.querySelector(`#${id}`)
    })
    return DOMs
}