import contentFromHtml from '../js/utils/contentFromHTML.js';

// ?the content must be a function otherwise shadowRoot append nothing after initial construction
function content() {
	return contentFromHtml(`<style>
  
label {
  position: relative;
  margin-left: 30px;
  height: 50px;
  display: flex;
  align-items: center;
  color: var(--color-em);
  font-size: 2rem;
}
label name {
}
label input {
}
</style>

<label for="binding">
    <slot name="and"></slot>
    <input type="text" id="binding">
</label>`);
}

export default class extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.append(content());
	}
}
