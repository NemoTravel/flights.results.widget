import FareFamiliesCombinations from '../../../schemas/FareFamiliesCombinations';
import { Action } from 'redux';

export const SET_FARE_FAMILIES_COMBINATIONS = 'SET_FARE_FAMILIES_COMBINATIONS';

export interface FareFamiliesCombinationsAction extends Action {
	payload: {
		flightId: number;
		combinations: FareFamiliesCombinations;
	};
}

export const setCombinations = (flightId: number, combinations: FareFamiliesCombinations): FareFamiliesCombinationsAction => {
	return {
		type: SET_FARE_FAMILIES_COMBINATIONS,
		payload: {
			flightId,
			combinations
		}
	};
};
