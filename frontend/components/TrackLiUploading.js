import contentFromHtml from '../js/utils/contentFromHTML.js'
function content() {
  return contentFromHtml(`
<style>
li {
  position: relative;
  margin: 5px 0;
  display: flex;
  flex-direction: column;
  padding: 10px 3rem 10px 1rem;
  border-radius: var(--bdr-r);
  color: var(--color-sec);
  transition: 500ms;
  border: 1px var(--color-sub) dashed;
  cursor: default;
}
#name {
  color: var(--color-pri);
}
#author {
  color: var(--color-sec);
  font-size: 0.7em;
}
.truncate {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
svg {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  fill: var(--color-sub);
  width: 1.2rem;
  height: 1.2rem;
}
</style>
<li>
    <span id="name" class="truncate"></span>
    <span id="author" class="truncate">Unknown</span>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
        <path d="M144 480C64.47 480 0 415.5 0 336C0 273.2 40.17 219.8 96.2 200.1C96.07 197.4 96 194.7 96 192C96 103.6 167.6 32 256 32C315.3 32 367 64.25 394.7 112.2C409.9 101.1 428.3 96 448 96C501 96 544 138.1 544 192C544 204.2 541.7 215.8 537.6 226.6C596 238.4 640 290.1 640 352C640 422.7 582.7 480 512 480H144zM223 263C213.7 272.4 213.7 287.6 223 296.1C232.4 306.3 247.6 306.3 256.1 296.1L296 257.9V392C296 405.3 306.7 416 320 416C333.3 416 344 405.3 344 392V257.9L383 296.1C392.4 306.3 407.6 306.3 416.1 296.1C426.3 287.6 426.3 272.4 416.1 263L336.1 183C327.6 173.7 312.4 173.7 303 183L223 263z"/>
    </svg>
</li>
`)
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
    this.shadowRoot.querySelector('#name').textContent = this.name
  }
}