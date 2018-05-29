import { Action } from 'redux';

export const FILTERS_TOGGLE_COMFORTABLE = 'FILTERS_TOGGLE_COMFORTABLE';
export const FILTERS_REMOVE_COMFORTABLE = 'FILTERS_REMOVE_COMFORTABLE';

export const toggleComfortable = (): Action => {
	return {
		type: FILTERS_TOGGLE_COMFORTABLE
	};
};

export const removeComfortable = (): Action => {
	return {
		type: FILTERS_REMOVE_COMFORTABLE
	};
};
