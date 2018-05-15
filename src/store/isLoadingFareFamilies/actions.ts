import { LegAction } from '../currentLeg/actions';

export const START_LOADING_FARE_FAMILIES = 'START_LOADING_FARE_FAMILIES';
export const STOP_LOADING_FARE_FAMILIES = 'STOP_LOADING_FARE_FAMILIES';

export const startLoadingFareFamilies = (legId: number): LegAction => {
	return {
		type: START_LOADING_FARE_FAMILIES,
		payload: legId
	};
};

export const stopLoadingFareFamilies = (legId: number): LegAction => {
	return {
		type: STOP_LOADING_FARE_FAMILIES,
		payload: legId
	};
};
