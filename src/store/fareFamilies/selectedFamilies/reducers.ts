import { SelectedFamiliesSegmentCombination, SelectedFamiliesState } from '../../../state';
import { SELECT_FAMILY, SelectedFamiliesAction } from './actions';

const selectedFamiliesSegmentCombinationReducer = (state: SelectedFamiliesSegmentCombination, action: SelectedFamiliesAction): SelectedFamiliesSegmentCombination => {
	return {
		...state,
		[action.payload.segmentId]: action.payload.familyId
	};
};

export const selectedFamiliesReducer = (state: SelectedFamiliesState = {}, action: SelectedFamiliesAction): SelectedFamiliesState => {
	switch (action.type) {
		case SELECT_FAMILY:
			return {
				...state,
				[action.payload.legId]: selectedFamiliesSegmentCombinationReducer(state[action.payload.legId], action)
			};
	}

	return state;
};