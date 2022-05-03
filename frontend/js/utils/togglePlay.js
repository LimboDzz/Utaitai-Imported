/**
 * toggle the play/pause button
 * @param {Boolean} paused if true, hide pause button
 */
export default function (paused) {
    document.querySelector('#play').classList.toggle('hidden', !paused)
    document.querySelector('#pause').classList.toggle('hidden', paused)
}