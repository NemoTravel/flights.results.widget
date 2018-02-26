import { SelectedFamiliesState } from '../../../state';
import { SELECT_FAMILY, SelectedFamiliesAction } from './actions';

export const selectedFamiliesReducer = (state: SelectedFamiliesState = {}, action: SelectedFamiliesAction): SelectedFamiliesState => {
	switch (action.type) {
		case SELECT_FAMILY:
			return {
				...state,
				[action.payload.segmentId]: action.payload.familyId
			};
	}

	return state;
};
