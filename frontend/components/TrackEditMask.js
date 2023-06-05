import contentFromHtml from '../js/utils/contentFromHTML.js';
import Toast from '../js/utils/Toast.js';
import elementFromHtml from '../js/utils/elementFromHTML.js';

// ?the content must be a function otherwise shadowRoot append nothing after initial construction
function content() {
	return contentFromHtml(`
<style>
    :host {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, .3);
        z-index: 100;
    }
    form {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 40vw;
        min-width: 400px;
        min-height: 300px;
        padding: 1.5rem;
        background-color: var(--bgc-bg);
        /* box-shadow: -2px 4px 1rem 0 var(--color-shadow); */
        border-radius: var(--bdr-r);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }
    #closeMask {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 2rem;
        height: 2rem;
        fill: var(--color-em);
        cursor: pointer;
        background-color: var(--bgc-em);
    }
    #closeMask:hover {
        fill: var(--bgc-vi);
    }
    label {
        color: var(--color-pri);
        font-size: 1rem;
    }
    input {
        width: 100%;
        border-radius: var(--bdr-r);
        border: none;
        outline: none;
        padding: 1rem;
        font-size: 1rem;
        color: var(--color-em);
        background-color: var(--bgc-em);
    }
    #tagContainer {
        padding: 1rem;
        width: 300px;
        background-color: var(--bgc-em);
        border-radius: var(--bdr-r);
        display: flex;
        flex-wrap: wrap;
    }
    .tag {
        margin: 0px 5px 5px 0;
        padding: 5px 5px 5px 10px;
        border-radius: var(--bdr-r);
        background-color: var(--bgc-vi);
        color: var(--bgc-fg);
        width: fit-content;
        display: flex;
        align-items: center;
    }
    #removeTag {
        box-sizing: content-box;
        padding: 5px;
        width: 1rem;
        height: 1rem;
        fill: var(--bgc-fg);
        cursor: pointer;
    }
    #tagContainer input {
        padding: 0;
        padding-left: 5px;
        border: none;
        outline: none;
        background-color: transparent;
        width: 100%;
        width: 120px;
    }
    .btns {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
    }
    .btns div {
        width: 200px;
        padding: 1rem 0;
        text-align: center;
        background-color: var(--bgc-em);
        margin-bottom: 1rem;
        font-size: 1rem;
        border-radius: var(--bdr-r);
        cursor: pointer;
        font-weight: bold;
        color: var(--color-em);
    }
    #delete:hover {
        color: var(--bgc-em);
        background-color: var(--bgc-vi);
    }
</style>
<form>
    <div class="inputs">
    <label for="name">
        <p>Track Name</p>
        <input type="text" name="name" id="name">
    </label>
    <label for="author">
        <p>Track Author</p>
        <input type="text" name="author" id="author">
    </label>
    <label for="addTag">
        <p>Tags (Press enter to add new tag)</p>
        <div id="tagContainer">
            <input type="text" id="addTag">
        </div>
    </label>
    </div>
    <div class="btns">
    <div id="confirm">Confirm changes</div>
    <div id="delete">Delete track</div>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" id="closeMask">
        <path d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM143 208.1L190.1 255.1L143 303C133.7 312.4 133.7 327.6 143 336.1C152.4 346.3 167.6 346.3 176.1 336.1L223.1 289.9L271 336.1C280.4 346.3 295.6 346.3 304.1 336.1C314.3 327.6 314.3 312.4 304.1 303L257.9 255.1L304.1 208.1C314.3 199.6 314.3 184.4 304.1 175C295.6 165.7 280.4 165.7 271 175L223.1 222.1L176.1 175C167.6 165.7 152.4 165.7 143 175C133.7 184.4 133.7 199.6 143 208.1V208.1z"/>
    </svg>
</form>
`);
}

export default class extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.append(content());
	}
	connectedCallback() {
		this.initInputs();
		this.initTags();
		this.closeBtn();
		this.confirmBtn();
		this.deleteBtn();
		this.addTagBtn();
	}

	addTagBtn() {
		const addTag = this.shadowRoot.querySelector('#addTag');
		addTag.addEventListener('keydown', e => {
			if (e.key != 'Enter' || !addTag.value) return;
			this.addTag(addTag.value);
			addTag.value = '';
		});
	}
	initInputs() {
		this.shadowRoot.querySelector('#name').value = this.name;
		this.shadowRoot.querySelector('#author').value = this.author;
	}

	closeBtn() {
		this.shadowRoot
			.querySelector('#closeMask')
			.addEventListener('click', () => {
				this.remove();
			});
	}

	confirmBtn() {
		this.shadowRoot
			.querySelector('#confirm')
			.addEventListener('click', async () => {
				// get new values from input
				this.name = this.shadowRoot.querySelector('#name').value;
				this.author = this.shadowRoot.querySelector('#author').value;
				this.tags = this.getTags();

				// ?save to db
				const key = this.key;
				const name = this.name;
				const author = this.author;
				const tags = this.tags;
				console.log(this.tags);
				const res = await fetch(`/track/${key}`, {
					// ?methods needs to be UPPERCASE
					method: 'PATCH',
					// ?Object to JSON
					body: JSON.stringify({ name, author, tags }),
					headers: {
						'Content-type': 'application/json',
					},
				});
				const { msg } = await res.json();
				if (msg) Toast.send(msg, 'alert');
				else this.updateTrackLi();
				this.remove();
			});
	}
	deleteBtn() {
		this.shadowRoot
			.querySelector('#delete')
			.addEventListener('click', async () => {
				const name = this.name;
				const key = this.key;
				const res = await fetch(`/blob`, {
					method: 'DELETE',
					body: JSON.stringify({ name, key }),
					headers: {
						'Content-Type': 'application/json',
					},
				});
				const { msg } = await res.json();
				if (msg) Toast.send(msg, 'failure');
				else {
					this.deleteTrackLi();
				}
				this.remove();
			});
	}

	updateTrackLi() {
		const trackLi = document.querySelector(`[key="${this.key}"]`);
		trackLi.setAttribute('name', this.name);
		trackLi.setAttribute('author', this.author);
		trackLi.tags = this.tags;
	}

	deleteTrackLi() {
		const trackLi = document.querySelector(`[key="${this.key}"]`);
		if (trackLi.playing == 'true') {
			const audioPlayer = document.querySelector('#audioPlayer');
			audioPlayer.pause();
			audioPlayer.src = '';
			document.querySelector(
				'#dndUploadLyrics'
			).innerHTML = `<div id="noLyrics">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
            d="M384 32H64.01C28.66 32 .0085 60.65 .0065 96L0 415.1C-.002 451.3 28.65 480 64 480h232.1c25.46 0 49.88-10.12 67.89-28.12l55.88-55.89C437.9 377.1 448 353.6 448 328.1V96C448 60.8 419.2 32 384 32zM52.69 427.3C50.94 425.6 48 421.8 48 416l.0195-319.1C48.02 87.18 55.2 80 64.02 80H384c8.674 0 16 7.328 16 16v192h-88C281.1 288 256 313.1 256 344v88H64C58.23 432 54.44 429.1 52.69 427.3zM330.1 417.9C322.9 425.1 313.8 429.6 304 431.2V344c0-4.406 3.594-8 8-8h87.23c-1.617 9.812-6.115 18.88-13.29 26.05L330.1 417.9z" />
            </svg>
            <p>Select a track</p>
            <p>View your lyrics here</p>
            </div>`;
		}
		trackLi.remove();
	}

	getTags() {
		const tagList = this.shadowRoot.querySelectorAll('.tag-name');
		const tags = [];
		tagList.forEach(tag => {
			tags.push(tag.textContent);
		});
		return tags;
	}
	initTags() {
		for (let tagName of this.tags) {
			this.addTag(tagName);
		}
	}
	addTag(tagName) {
		const tag = elementFromHtml(`
            <span class="tag">
                <span class="tag-name">${tagName}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" id="removeTag">
                    <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/>
                </svg>
            </span>
            `);
		tag.addEventListener('click', () => {
			tag.remove();
		});
		this.shadowRoot.querySelector('#addTag').before(tag);
	}
}
