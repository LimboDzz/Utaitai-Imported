import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage, SavePage, SettingsPage } from './pages';
import { ProgressBar } from '../components';

const MainArea = () => {
	return (
		<div className='main'>
			<ProgressBar />
			<Routes>
				<Route
					path='/playlist'
					element={<HomePage />}
				/>
				<Route
					path='/save'
					element={<SavePage />}
				/>
				<Route
					path='/settings'
					element={<SettingsPage />}
				/>
			</Routes>
		</div>
	);
};

export default MainArea;
