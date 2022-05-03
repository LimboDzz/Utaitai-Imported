/**
 * toggle the query-plus/check button
 * @param {Boolean} checked if true, hide plus button
 */
export default function (checked) {
    document.querySelector('#query-check').classList.toggle('hidden', !checked)
    document.querySelector('#query-plus').classList.toggle('hidden', checked)
}