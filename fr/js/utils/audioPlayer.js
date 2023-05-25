export default function () {
    const player = document.querySelector(`#audioPlayer`)
    const playlistLinks = document.querySelectorAll(`#views>a`)
    const trackInfo = document.querySelector(`#currentTrackInfo .info`)
    playlistLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault()
            playlistLinks.forEach(link => {
                link.classList.remove("playing")
            })
            this.classList.add("playing")
            player.src = this.href
            player.play()

            trackInfo.firstElementChild.textContent = this.firstElementChild.textContent
            trackInfo.lastElementChild.textContent = this.lastElementChild.textContent
        })
    })
}