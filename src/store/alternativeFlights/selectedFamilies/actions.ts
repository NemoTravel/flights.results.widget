import { Action } from 'redux';

export const SELECT_FAMILY = 'SELECT_FAMILY';

export interface SelectedFamiliesAction extends Action {
	payload: {
		legId: number;
		segmentId: number;
		familyId: string;
	}
}

export type SelectFamily = (legId: number, segmentId: number, familyId: string) => SelectedFamiliesAction;

export const selectFamily = (legId: number, segmentId: number, familyId: string): SelectedFamiliesAction => {
	return {
		type: SELECT_FAMILY,
		payload: {
			legId,
			familyId,
			segmentId
		}
	};
};
