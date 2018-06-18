import FareFamiliesCombinations from '../../../schemas/FareFamiliesCombinations';
import { Action } from 'redux';

export const SET_FARE_FAMILIES_COMBINATIONS = 'SET_FARE_FAMILIES_COMBINATIONS';
export const CLEAR_FARE_FAMILIES_COMBINATIONS = 'CLEAR_FARE_FAMILIES_COMBINATIONS';

export interface FareFamiliesCombinationsAction extends Action {
	payload: {
		legId: number;
		combinations: FareFamiliesCombinations;
	};
}

export const clearCombinations = (): Action => {
	return {
		type: CLEAR_FARE_FAMILIES_COMBINATIONS
	};
};

export const setCombinations = (legId: number, combinations: FareFamiliesCombinations): FareFamiliesCombinationsAction => {
	return {
		type: SET_FARE_FAMILIES_COMBINATIONS,
		payload: {
			legId,
			combinations
		}
	};
};
