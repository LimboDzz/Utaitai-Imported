import contentFromHtml from '../js/utils/contentFromHTML.js'
function content() {
    return contentFromHtml(`
<style>
#card {
  background-color: #000;
  color: #fff;
}
</style>`)
}

export default class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.append(content())
    }
    connectedCallback() {
        this.init()
    }
    init() {
        this.shadowRoot.querySelector('#query').textContent = this.query
    }
}