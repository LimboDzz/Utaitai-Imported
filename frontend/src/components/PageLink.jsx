import React from 'react';
import { Link } from 'react-router-dom';

const PageLink = ({ to }) => {
	return (
		<div className='pageLink em-select'>
			<img src={`src/assets/${to}PageLink.svg`} />
			<Link to={to}>{to}</Link>
		</div>
	);
};

export default PageLink;
