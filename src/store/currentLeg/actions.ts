export const NEXT_LEG = 'NEXT_LEG';
export const SET_LEG = 'SET_LEG';
export const GO_TO_LEG = 'GO_TO_LEG';
export const GO_BACK = 'GO_BACK';

export type LegAction = ReturnType<typeof setLeg>;

export const nextLeg = () => {
	return {
		type: NEXT_LEG
	};
};

export const setLeg = (legId: number) => {
	return {
		type: SET_LEG,
		payload: legId
	};
};

export const goToLeg = (legId: number) => {
	return {
		type: GO_TO_LEG,
		payload: legId
	};
};

export const goBack = () => {
	return {
		type: GO_BACK
	};
};
