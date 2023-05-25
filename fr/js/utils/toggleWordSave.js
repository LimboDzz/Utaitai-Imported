/**
 * toggle the queryAdd/check button
 * @param {Boolean} checked if true, hide plus button
 */
export default function (checked) {
    document.querySelector('#queryCheck').classList.toggle('hidden', !checked)
    document.querySelector('#queryAdd').classList.toggle('hidden', checked)
}