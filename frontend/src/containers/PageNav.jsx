import React from 'react';
import { PageLink } from '../components';
import './PageNav.css';

const PageNav = () => {
	return (
		<div className='nav'>
			<div className='logo' />
			<div className='pageLinks'>
				<PageLink to='/home' />
				<PageLink to='/Save' />
				<PageLink to='/Settings' />
			</div>
		</div>
	);
};

export default PageNav;
