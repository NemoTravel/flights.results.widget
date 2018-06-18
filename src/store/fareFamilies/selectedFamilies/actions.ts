import { Action } from 'redux';

export const SELECT_FAMILY = 'SELECT_FAMILY';
export const CLEAR_SELECTED_FAMILIES = 'CLEAR_SELECTED_FAMILIES';

export type SelectedFamiliesAction = ReturnType<typeof selectFamily>;

export const clearSelectedFamilies = (): Action => {
	return {
		type: CLEAR_SELECTED_FAMILIES
	};
};

export const selectFamily = (legId: number, segmentId: number, familyId: string) => {
	return {
		type: SELECT_FAMILY,
		payload: {
			legId,
			familyId,
			segmentId
		}
	};
};
