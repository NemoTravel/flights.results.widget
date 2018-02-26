import { Action } from 'redux';

export const SELECT_FAMILY = 'SELECT_FAMILY';

export interface SelectedFamiliesAction extends Action {
	payload: {
		familyId: number;
		segmentId: number;
	}
}

export const selectFamily = (segmentId: number, familyId: number): SelectedFamiliesAction => {
	return {
		type: SELECT_FAMILY,
		payload: {
			familyId,
			segmentId
		}
	};
};
