import { Action } from 'redux';

export const FILTERS_REMOVE_ALL = 'FILTERS_REMOVE_ALL';

export const remoteAllFilters = (): Action => {
	return {
		type: FILTERS_REMOVE_ALL
	};
};
