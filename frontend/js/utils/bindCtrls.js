import togglePlay from './togglePlay.js'
import Toast from './Toast.js'
import toggleWordSave from './toggleWordSave.js'




export default function () {
    const audioPlayer = document.querySelector('#audioPlayer')
    const dndUploadLyric = document.querySelector('#dndUploadLyric')
    const progressBar = document.querySelector('#progress-bar')

    const queryCard = document.querySelector('#query-card')
    const queryCheck = document.querySelector('#query-check')
    const queryPlus = document.querySelector('#query-plus')
    const queryClose = document.querySelector('#query-close')

    const pause = document.querySelector('#pause')
    const play = document.querySelector('#play')
    const singleSongLoop = document.querySelector('#singleSongLoop')
    const lyricFollow = document.querySelector('#lyricFollow')
    const singleLineLoop = document.querySelector('#singleLineLoop')
    const offsetMinus = document.querySelector('#offsetMinus')
    const offsetPlus = document.querySelector('#offsetPlus')


    const multiSelect = document.querySelector('#multi-select')

    queryPlus.addEventListener('click', function () {
        toggleWordSave(true)
    })
    queryClose.addEventListener('click', function () {
        toggleWordSave(false)
        queryCard.classList.remove('popup')
    })
    // !querySelection
    dndUploadLyric.addEventListener('mouseup', function () {
        const selection = getSelection().toString()
        if (!selection) return
        // ?prevent click event
        window.selecting = true
        // ?render queryCard
        const head = queryCard.querySelector('.head')
        const body = queryCard.querySelector('.body')
        head.textContent = selection
        body.textContent = query(selection)
        toggleWordSave(false)
        queryCard.classList.add('popup')
    })

    // !scroll cancel lyricFollow
    dndUploadLyric.addEventListener('wheel', function () {
        if (audioPlayer.lyricFollow) {
            audioPlayer.lyricFollow = false;
            lyricFollow.classList.remove('enabled')
        }
    })
    // !ontimechange
    audioPlayer.addEventListener('timeupdate', function () {
        // ?update progress bar
        progressBar.style.width = 100 * this.currentTime / this.duration + "%"

        // ?cal nextLine then playiingLine
        const lines = Array.from(dndUploadLyric.querySelectorAll('.line'))
        let nextLine, playingLine
        nextLine = lines.find(line => this.currentTime < line.timestamp)
        playingLine = dndUploadLyric.querySelector('.line.playing')

        // todo end of song back to firstLine how????? done:normal follow
        let endtimestamp = playingLine.nextElementSibling.timestamp ?? audioPlayer.duration
        if (this.currentTime > endtimestamp) {
            // !end of playingLine, switch to nextLine
            if (this.singleLineLoop) {
                // ?singleLineLoop
                this.currentTime = playingLine.timestamp
            } else {
                playingLine.classList.remove('playing')
                nextLine.classList.add('playing')
            }
        }

        // ?lyricFollow
        if (this.lyricFollow) dndUploadLyric.scrollTo({
            behavior: "smooth",
            top: playingLine.offsetTop - 200
        })
    })
    audioPlayer.addEventListener('volumechange', function () {

    })
    audioPlayer.addEventListener('pause', function () {
        togglePlay(audioPlayer.paused)
    })
    audioPlayer.addEventListener('play', function () {
        togglePlay(audioPlayer.paused)
    })
    singleSongLoop.addEventListener('click', function () {
        audioPlayer.loop = !audioPlayer.loop
        this.classList.toggle('enabled')
    })
    pause.addEventListener('click', function () {
        audioPlayer.pause()
    })
    play.addEventListener('click', function () {
        if (!audioPlayer.src) {
            document.querySelector('track-li').shadowRoot.querySelector('li').click()
            if (!audioPlayer.src) return
        }
        audioPlayer.play()
    })
    lyricFollow.addEventListener('click', function () {
        this.classList.toggle('enabled')
        audioPlayer.lyricFollow = !audioPlayer.lyricFollow
    })
    singleLineLoop.addEventListener('click', function () {
        this.classList.toggle('enabled')
        audioPlayer.singleLineLoop = !audioPlayer.singleLineLoop
    })


    offsetMinus.addEventListener('click', tinkerMinus)
    offsetPlus.addEventListener('click', tinkerPlus)
    multiSelect.addEventListener('click', function () { })


    function tinkerMinus() {
        tinkerOffset(audioPlayer.offset)
    }
    function tinkerPlus() {
        tinkerOffset(-audioPlayer.offset)
    }
    async function tinkerOffset(offset) {
        // ?minus:timestamp++
        // ?plus:timestamp--

        const track = document.querySelector('track-li[playing="true"]')
        track.offset += offset

        const res = await fetch(`/track/${track.key}`, {
            method: "PATCH",
            body: JSON.stringify({ offset: track.offset }),
            headers: {
                "Content-type": "application/json"
            }
        })
        const { msg } = await res.json()
        if (msg) {
            Toast.send(`err: fail to set back ${offset}ms.`, `alert`)
        } else {
            const lines = dndUploadLyric.querySelectorAll('.line')
            lines.forEach(line => line.timestamp += (offset / 1000))
            Toast.send(`Set back ${offset}ms.`, `success`)
        }
    }

    function query(word) {
        return "bodyinformation"
    }
}