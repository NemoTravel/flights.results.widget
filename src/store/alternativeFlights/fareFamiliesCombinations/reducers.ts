import { FareFamiliesCombinationsState } from '../../../state';
import { FareFamiliesCombinationsAction, SET_FARE_FAMILIES_COMBINATIONS } from './actions';

export const fareFamiliesCombinationsReducer = (state: FareFamiliesCombinationsState = {}, action: FareFamiliesCombinationsAction): FareFamiliesCombinationsState => {
	switch (action.type) {
		case SET_FARE_FAMILIES_COMBINATIONS:
			const combinations = action.payload.combinations;
			const result = { ...state };

			if (combinations) {
				result[action.payload.legId] = combinations;
			}

			return result;
	}

	return state;
};
