export default class {
    constructor(mountingPoint, html) {
        this.mountingPoint = document.querySelector(mountingPoint)
        this.originalHTML = mountingPoint.innerHTML
        this.html = html
    }
    mount() {
        this.mountingPoint.innerHTML = this.html
    }
    restore() {
        this.mountingPoint.innerHTML = this.originalHTML
    }
}