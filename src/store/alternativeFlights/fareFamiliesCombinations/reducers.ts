import { FareFamiliesCombinationsState } from '../../../state';
import { FareFamiliesCombinationsAction, SET_FARE_FAMILIES_COMBINATIONS } from './actions';

export const fareFamiliesCombinationsReducer = (state: FareFamiliesCombinationsState = {}, action: FareFamiliesCombinationsAction): FareFamiliesCombinationsState => {
	switch (action.type) {
		case SET_FARE_FAMILIES_COMBINATIONS:
			return {
				...state,
				[action.payload.legId]: action.payload.combinations
			};
	}

	return state;
};
