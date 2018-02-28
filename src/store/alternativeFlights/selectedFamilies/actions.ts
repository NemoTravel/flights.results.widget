import { Action } from 'redux';
import { CommonThunkAction } from '../../../state';

export const SELECT_FAMILY = 'SELECT_FAMILY';

export interface SelectedFamiliesAction extends Action {
	payload: {
		legId: number;
		segmentId: number;
		familyId: string;
	}
}

export type SelectFamily = (legId: number, segmentId: number, familyId: string) => CommonThunkAction;

export const setSelectedFamily = (legId: number, segmentId: number, familyId: string): SelectedFamiliesAction => {
	return {
		type: SELECT_FAMILY,
		payload: {
			legId,
			familyId,
			segmentId
		}
	};
};

export const selectFamily = (legId: number, segmentId: number, familyId: string): CommonThunkAction => {
	return (dispatch, getState) => {
		dispatch(setSelectedFamily(legId, segmentId, familyId));
	};
};
