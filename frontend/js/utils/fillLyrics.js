import elementFromHtml from './elementFromHTML.js'



/**
 * fill array of {timestamp,content} into view
 * @param {Array} lyrics 
 * @param {Number} offset in ms 
 */
export default function (lyrics, offset) {
    const dndUploadLyrics = document.querySelector("#dndUploadLyrics")
    const audioPlayer = document.querySelector('#audioPlayer')

    audioPlayer.lyricsLoaded = false
    dndUploadLyrics.innerHTML = ""
    for (let [idx, { timestamp, content }] of lyrics.entries()) {
        if (!content) continue
        const line = elementFromHtml(`
            <div class="em-select list-item line">${content}</div>
        `)
        line.timestamp = timestamp + offset
        line.addEventListener('click', function () {
            if (window.selecting) return
            const lines = document.querySelectorAll(`#dndUploadLyrics>.line`)
            lines.forEach(line => {
                if (line == this)
                    line.classList.add('playing')
                else
                    line.classList.remove('playing')
            })

            audioPlayer.currentTime = this.timestamp
            audioPlayer.play()
        })
        dndUploadLyrics.appendChild(line)
    }
    dndUploadLyrics.firstElementChild.classList.add('playing')
    audioPlayer.lyricsLoaded = true
}