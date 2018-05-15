import { Action } from 'redux';

export const START_LOADING_FARE_FAMILIES = 'START_LOADING_FARE_FAMILIES';
export const STOP_LOADING_FARE_FAMILIES = 'STOP_LOADING_FARE_FAMILIES';

export const startLoadingFareFamilies = (): Action => {
	return {
		type: START_LOADING_FARE_FAMILIES
	};
};

export const stopLoadingFareFamilies = (): Action => {
	return {
		type: STOP_LOADING_FARE_FAMILIES
	};
};
