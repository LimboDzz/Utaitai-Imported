import contentFromHtml from '../js/utils/contentFromHTML.js';
import fillLyrics from '../js/utils/fillLyrics.js';

// ?the content must be a function otherwise shadowRoot append nothing after initial construction
function content() {
	return contentFromHtml(`<style>
#name {
  color: var(--color-pri);
}
#author {
  color: var(--color-sec);
  font-size: 0.7em;
}
li {
  position: relative;
  margin: 5px 0;
  display: flex;
  flex-direction: column;
  padding: 10px 3rem 10px 1rem;
  border-radius: var(--bdr-r);
  cursor: pointer;
  color: var(--color-sec);
  transition: 100ms;
}
li:hover {
  color: var(--color-em);
  background-color: var(--bgc-em);
}
.truncate {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
svg {
  display: none;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  fill: var(--bgc-vi);
  width: 1rem;
  height: 1rem;
}
li:hover svg {
  display: block;
}
.playing {
  background-color: var(--bgc-em);
}

</style>
<li>
    <span id="name" class="truncate"></span>
    <span id="author" class="truncate"></span>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M490.3 40.4C512.2 62.27 512.2 97.73 490.3 119.6L460.3 149.7L362.3 51.72L392.4 21.66C414.3-.2135 449.7-.2135 471.6 21.66L490.3 40.4zM172.4 241.7L339.7 74.34L437.7 172.3L270.3 339.6C264.2 345.8 256.7 350.4 248.4 353.2L159.6 382.8C150.1 385.6 141.5 383.4 135 376.1C128.6 370.5 126.4 361 129.2 352.4L158.8 263.6C161.6 255.3 166.2 247.8 172.4 241.7V241.7zM192 63.1C209.7 63.1 224 78.33 224 95.1C224 113.7 209.7 127.1 192 127.1H96C78.33 127.1 64 142.3 64 159.1V416C64 433.7 78.33 448 96 448H352C369.7 448 384 433.7 384 416V319.1C384 302.3 398.3 287.1 416 287.1C433.7 287.1 448 302.3 448 319.1V416C448 469 405 512 352 512H96C42.98 512 0 469 0 416V159.1C0 106.1 42.98 63.1 96 63.1H192z"/>
    </svg>
</li>
`);
}

export default class extends HTMLElement {
	static get observedAttributes() {
		return ['name', 'author', 'playing'];
	}
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.shadowRoot.append(content());
	}
	connectedCallback() {
		this.init();
		this.loadAndPlay();
		this.editBtn();
	}
	attributeChangedCallback(attr, oldValue, newValue) {
		switch (attr) {
			case 'playing':
				{
					const li = this.shadowRoot.querySelector('li');
					if (newValue == 'true') li.className = 'playing';
					else li.className = '';
				}
				break;
			default:
				this.init();
				break;
		}
	}

	// key, size, lyrics, createAt, name, author = "Unknown"
	set key(value) {
		this.setAttribute('key', value);
	}
	get key() {
		return this.getAttribute('key');
	}
	set name(value) {
		this.setAttribute('name', value);
	}
	get name() {
		return this.getAttribute('name');
	}
	set author(value) {
		this.setAttribute('author', value);
	}
	get author() {
		return this.getAttribute('author');
	}
	// ?playing is string "true" or "false", not boolean
	set playing(value) {
		this.setAttribute('playing', value);
	}
	get playing() {
		return this.getAttribute('playing');
	}
	get url() {
		return this.getAttribute('url');
	}
	// get lyrics() {
	//     return this.getAttribute("lyrics")
	// }
	// get size() {
	//     return this.getAttribute("size")
	// }
	// get createAt() {
	//     return this.getAttribute("createAt")
	// }
	init() {
		this.shadowRoot.querySelector('#name').textContent = this.name;
		this.shadowRoot.querySelector('#author').textContent = this.author;
	}
	loadAndPlay() {
		this.shadowRoot.querySelector('li').addEventListener('click', () => {
			this.loadLyrics();
			this.play();
			this.setTrackInfo();
		});
	}
	editBtn() {
		this.shadowRoot.querySelector('svg').addEventListener('click', e => {
			e.stopPropagation();
			const mask = document.createElement('track-edit-mask');
			mask.key = this.key;
			mask.name = this.name;
			mask.author = this.author;
			mask.tags = this.tags;
			mask.url = this.url;
			document.body.append(mask);
		});
	}
	setTrackInfo() {
		const trackInfo = document.querySelector(`#currentTrackInfo`);
		trackInfo.firstElementChild.textContent = this.name;
		trackInfo.lastElementChild.textContent = this.author;
	}
	play() {
		const player = document.querySelector(`#audioPlayer`);
		const trackLis = document.querySelectorAll(`#dndUploadTrack>track-li`);
		trackLis.forEach(trackLi => {
			trackLi == this ? (trackLi.playing = true) : (trackLi.playing = false);
		});
		// previously src=/blob/:key
		// now that the key is url, you can set it directly to play audio
		player.src = `${this.url}`;
		player.play();
	}
	async loadLyrics() {
		const player = document.querySelector(`#audioPlayer`);
		const res = await fetch(`/lyric/${this.key}`);
		const { lyrics, offset } = await res.json();
		if (lyrics.length > 0) {
			// ?lyrics exists
			fillLyrics(lyrics, offset);
		} else {
			// ?no lyrics
			player.lyricsLoaded = false;
			const dndUploadLyrics = document.querySelector('#dndUploadLyrics');
			dndUploadLyrics.innerHTML = ``;
			dndUploadLyrics.append(
				contentFromHtml(`
<div id="noLyrics">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M384 32H64.01C28.66 32 .0085 60.65 .0065 96L0 415.1C-.002 451.3 28.65 480 64 480h232.1c25.46 0 49.88-10.12 67.89-28.12l55.88-55.89C437.9 377.1 448 353.6 448 328.1V96C448 60.8 419.2 32 384 32zM52.69 427.3C50.94 425.6 48 421.8 48 416l.0195-319.1C48.02 87.18 55.2 80 64.02 80H384c8.674 0 16 7.328 16 16v192h-88C281.1 288 256 313.1 256 344v88H64C58.23 432 54.44 429.1 52.69 427.3zM330.1 417.9C322.9 425.1 313.8 429.6 304 431.2V344c0-4.406 3.594-8 8-8h87.23c-1.617 9.812-6.115 18.88-13.29 26.05L330.1 417.9z"/>
    </svg>
    <p>No associated lyrics</p>
    <p>Drag and drop <b>.lrc</b> here</p>
</div>
`)
			);
		}
	}
}
