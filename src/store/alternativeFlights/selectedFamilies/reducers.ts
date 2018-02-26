import { SelectedFamiliesState } from '../../../state';
import { AnyAction } from 'redux';
import { SELECT_FAMILY } from './actions';

export const selectedFamiliesReducer = (state: SelectedFamiliesState = {}, action: AnyAction): SelectedFamiliesState => {
	switch (action.type) {
		case SELECT_FAMILY:
			return state;
	}

	return state;
};
