import {
	CLEAR_FARE_FAMILIES_COMBINATIONS,
	FareFamiliesCombinationsAction,
	SET_FARE_FAMILIES_COMBINATIONS
} from './actions';
import FareFamiliesCombinations from '../../../schemas/FareFamiliesCombinations';

export interface FareFamiliesCombinationsState {
	[legId: number]: FareFamiliesCombinations;
}

export const fareFamiliesCombinationsReducer = (state: FareFamiliesCombinationsState = {}, action: FareFamiliesCombinationsAction): FareFamiliesCombinationsState => {
	switch (action.type) {
		case SET_FARE_FAMILIES_COMBINATIONS:
			const combinations = action.payload.combinations;
			const result = { ...state };

			if (combinations) {
				result[action.payload.legId] = combinations;
			}

			return result;

		case CLEAR_FARE_FAMILIES_COMBINATIONS:
			return {};
	}

	return state;
};
