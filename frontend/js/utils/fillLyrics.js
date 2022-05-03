import elementFromHtml from './elementFromHTML.js'



/**
 * fill array of {timestamp,content} into view
 * @param {Array} lyrics 
 * @param {Number} offset in ms 
 */
export default function (lyrics, offset) {
    const dndUploadLyric = document.querySelector("#dndUploadLyric")
    dndUploadLyric.innerHTML = ""
    for (let [idx, { timestamp, content }] of lyrics.entries()) {
        if (!content) continue
        const line = elementFromHtml(`
            <div class="em-select list-item line">${content}</div>
        `)
        line.timestamp = timestamp + offset
        if (idx == 0) line.classList.add('playing')
        line.addEventListener('click', function () {
            if (window.selecting) return
            const lines = document.querySelectorAll(`#dndUploadLyric>.line`)
            lines.forEach(line => {
                if (line == this)
                    line.classList.add('playing')
                else
                    line.classList.remove('playing')
            })

            const audioPlayer = document.querySelector('#audioPlayer')
            audioPlayer.currentTime = this.timestamp
            audioPlayer.play()
        })
        dndUploadLyric.appendChild(line)
    }
}