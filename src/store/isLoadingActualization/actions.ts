import { Action } from 'redux';

export const START_LOADING_ACTUALIZATION = 'START_LOADING_ACTUALIZATION';
export const STOP_LOADING_ACTUALIZATION = 'STOP_LOADING_ACTUALIZATION';

export const startLoadingActualization = (): Action => {
	return {
		type: START_LOADING_ACTUALIZATION
	};
};

export const stopLoadingActualization = (): Action => {
	return {
		type: STOP_LOADING_ACTUALIZATION
	};
};
