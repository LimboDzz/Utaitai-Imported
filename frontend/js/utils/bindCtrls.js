import togglePlay from './togglePlay.js';
import Toast from './Toast.js';

export default function () {
	const audioPlayer = document.querySelector('#audioPlayer');
	const dndUploadLyrics = document.querySelector('#dndUploadLyrics');
	const noteList = document.querySelector('#noteList');
	const progressBar = document.querySelector('#progressBar');

	const queryPopup = document.querySelector('#queryPopup');
	const queryCheck = document.querySelector('#queryCheck');
	const queryAdd = document.querySelector('#queryAdd');
	const queryClose = document.querySelector('#queryClose');
	const head = queryPopup.querySelector('.head');
	const body = queryPopup.querySelector('.body');

	const pause = document.querySelector('#pause');
	const play = document.querySelector('#play');
	const singleSongLoop = document.querySelector('#singleSongLoop');
	const lineFollow = document.querySelector('#lineFollow');
	const singleLineLoop = document.querySelector('#singleLineLoop');
	const offsetMinus = document.querySelector('#offsetMinus');
	const offsetPlus = document.querySelector('#offsetPlus');
	const volume = document.querySelector('#volume');

	const toDndUploadTrack = document.querySelector('#toDndUploadTrack');
	const toNoteList = document.querySelector('#toNoteList');
	const toSettings = document.querySelector('#toSettings');

	const multiSelect = document.querySelector('#multi-select');

	volume.addEventListener('change', function () {
		audioPlayer.volume = this.value;
	});

	// ?scroll cancel lineFollow
	dndUploadLyrics.addEventListener('wheel', function () {
		if (audioPlayer.lineFollow) {
			audioPlayer.lineFollow = false;
			lineFollow.classList.remove('enabled');
		}
	});
	// ?ontimechange
	audioPlayer.addEventListener('timeupdate', function () {
		if (!audioPlayer.lyricsLoaded) return;

		// ?update progress bar
		progressBar.style.width = (100 * this.currentTime) / this.duration + '%';

		// ?end of song back to firstLine
		if (this.currentTime < 0.5) {
			dndUploadLyrics.lastElementChild.classList.remove('playing');
			dndUploadLyrics.firstElementChild.classList.add('playing');
		}
		// ?cal nextLine then playiingLine
		let playingLine = dndUploadLyrics.querySelector('.line.playing');
		playingLine.nextLine =
			playingLine.nextElementSibling ?? dndUploadLyrics.firstElementChild;

		let endtimestamp = playingLine.nextElementSibling
			? playingLine.nextElementSibling.timestamp
			: audioPlayer.duration;
		if (this.currentTime > endtimestamp) {
			// ?end of playingLine, switch to nextLine
			if (this.singleLineLoop) {
				// ?singleLineLoop
				this.currentTime = playingLine.timestamp;
			} else {
				playingLine.classList.remove('playing');
				playingLine.nextLine.classList.add('playing');
			}
		}

		// ?lineFollow
		if (this.lineFollow)
			dndUploadLyrics.scrollTo({
				behavior: 'smooth',
				top: playingLine.offsetTop - 200,
			});
	});
	audioPlayer.addEventListener('volumechange', function () {});
	audioPlayer.addEventListener('pause', function () {
		togglePlay(audioPlayer.paused);
	});
	audioPlayer.addEventListener('play', function () {
		togglePlay(audioPlayer.paused);
	});
	singleSongLoop.addEventListener('click', function () {
		audioPlayer.loop = !audioPlayer.loop;
		this.classList.toggle('enabled');
	});
	pause.addEventListener('click', function () {
		audioPlayer.pause();
	});
	play.addEventListener('click', function () {
		if (!audioPlayer.src) {
			document.querySelector('track-li').shadowRoot.querySelector('li').click();
			if (!audioPlayer.src) return;
		}
		audioPlayer.play();
	});
	lineFollow.addEventListener('click', function () {
		this.classList.toggle('enabled');
		audioPlayer.lineFollow = !audioPlayer.lineFollow;
	});
	singleLineLoop.addEventListener('click', function () {
		this.classList.toggle('enabled');
		audioPlayer.singleLineLoop = !audioPlayer.singleLineLoop;
	});

	offsetMinus.addEventListener('click', tinkerMinus);
	offsetPlus.addEventListener('click', tinkerPlus);
	multiSelect.addEventListener('click', function () {});

	function tinkerMinus() {
		tinkerOffset(audioPlayer.offset);
	}
	function tinkerPlus() {
		tinkerOffset(-audioPlayer.offset);
	}
	async function tinkerOffset(offset) {
		// ?minus:timestamp++
		// ?plus:timestamp--

		const track = document.querySelector('track-li[playing="true"]');
		track.offset += offset;

		const res = await fetch(`/track/${track.key}`, {
			method: 'PATCH',
			body: JSON.stringify({ offset: track.offset }),
			headers: {
				'Content-type': 'application/json',
			},
		});
		const { msg } = await res.json();
		if (msg) {
			Toast.send(`err: fail to set back ${offset}ms.`, `alert`);
		} else {
			const lines = dndUploadLyrics.querySelectorAll('.line');
			lines.forEach(line => (line.timestamp += offset / 1000));
			Toast.send(`Set back ${offset}ms.`, `success`);
		}
	}
}
