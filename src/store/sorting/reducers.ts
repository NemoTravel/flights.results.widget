import { SortingDirection, SortingState, SortingType } from '../../state';
import { SET_SORTING, SortingAction } from './actions';

const initialState: SortingState = {
	type: SortingType.Price,
	direction: SortingDirection.ASC
};

export const sortingReducer = (state: SortingState = initialState, action: SortingAction): SortingState => {
	switch (action.type) {
		case SET_SORTING:
			return {
				type: action.payload.type,
				direction: action.payload.direction
			};
	}

	return state;
};
