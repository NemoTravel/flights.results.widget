import { Action } from 'redux';

export const START_LOADING = 'START_LOADING';
export const STOP_LOADING = 'STOP_LOADING';

export const startLoading = (): Action => {
	return {
		type: START_LOADING
	};
};

export const stopLoading = (): Action => {
	return {
		type: STOP_LOADING
	};
};
