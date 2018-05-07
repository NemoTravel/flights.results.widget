import { Action } from 'redux';
import { SortingDirection, SortingType } from '../../enums';

export const SET_SORTING = 'SET_SORTING';

export interface SortingAction extends Action {
	payload: {
		type: SortingType;
		direction: SortingDirection;
	}
}

export const setSorting = (type: SortingType, direction: SortingDirection): SortingAction => {
	return {
		type: SET_SORTING,
		payload: {
			type,
			direction
		}
	};
};
