export const SELECT_FAMILY = 'SELECT_FAMILY';

export type SelectedFamiliesAction = ReturnType<typeof selectFamily>;

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
