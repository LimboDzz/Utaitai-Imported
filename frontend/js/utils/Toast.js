export default {
    init() {
        const toast = document.createElement('div')
        toast.id = "toast"
        toast.className = "toast"
        document.body.appendChild(toast)
    },
    send(msg, type) {
        clearTimeout(this.timeout)
        this.el = document.querySelector('#toast')
        this.el.textContent = msg
        this.el.className = `toast toast-${type}`
        this.el.classList.add(`toast-active`)

        this.timeout = setTimeout(() => {
            this.el.classList.remove("toast-active")
        }, 5000)
    }
}