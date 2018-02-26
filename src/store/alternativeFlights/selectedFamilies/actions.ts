import { Action } from 'redux';

export const SELECT_FAMILY = 'SELECT_FAMILY';

export interface SelectedFamiliesAction extends Action {
	payload: {
		familyId: number;
		segmentId: number;
	}
}

export const selectFamily = (familyId: number, segmentId: number): SelectedFamiliesAction => {
	return {
		type: SELECT_FAMILY,
		payload: {
			familyId,
			segmentId
		}
	};
};
