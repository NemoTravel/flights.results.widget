import { Action } from 'redux';

export const FILTERS_TOGGLE_USABLE = 'FILTERS_TOGGLE_USABLE';

export const toggleUsable = (): Action => {
	return {
		type: FILTERS_TOGGLE_USABLE
	};
};
