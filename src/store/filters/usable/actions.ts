import { Action } from 'redux';

export const FILTERS_TOGGLE_USABLE = 'FILTERS_TOGGLE_USABLE';
export const FILTERS_REMOVE_USABLE = 'FILTERS_REMOVE_USABLE';

export const toggleUsable = (): Action => {
	return {
		type: FILTERS_TOGGLE_USABLE
	};
};

export const removeUsable = (): Action => {
	return {
		type: FILTERS_REMOVE_USABLE
	};
};
