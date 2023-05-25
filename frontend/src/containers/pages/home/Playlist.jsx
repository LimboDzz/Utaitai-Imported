import React from 'react';

const Playlist = () => {
	return (
		<div className='playList'>
			<div id='selectSearch'>
				<a
					class='em-select'
					id='multi-select'
				>
					<i class=' fas fa-list-ul'></i>
				</a>
				<search-bar></search-bar>
			</div>
			<ul
				id='dndUploadTrack'
				class='drag-area'
			></ul>
			<ul
				id='noteList'
				class='hidden'
			></ul>
			<div id='currentTrackInfo'>
				<span class='item-pri truncate'>Out of My Mine</span>
				<span class='item-sec truncate'>Ducko Mcfie</span>
			</div>
		</div>
	);
};

export default Playlist;
