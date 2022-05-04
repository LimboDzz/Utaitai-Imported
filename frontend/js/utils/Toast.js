import elementFromHtml from './elementFromHTML.js'

/**
 * Toast nodification
 */
export default class {
    constructor() { }
    static send(msg, type) {
        // ?create and insert a toast
        const toast = elementFromHtml(`
<div class="toast toast-${type}">${msg}</div>
`)
        document.querySelector('#toastContainer').appendChild(toast)
        setTimeout(() => {
            toast.classList.add(`toast-active`)
        }, 1)
        // ?remove toast after transition
        setTimeout(() => {
            toast.addEventListener('transitionend', function () {
                this.remove()
            })
            toast.classList.remove('toast-active')
        }, 5000)
    }
}