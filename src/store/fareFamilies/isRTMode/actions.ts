export const FARE_FAMILIES_SET_RT_MODE = 'FARE_FAMILIES_SET_RT_MODE';

export type SetRTModeAction = ReturnType<typeof setRTMode>;

export const setRTMode = (isRT: boolean) => {
	return {
		type: FARE_FAMILIES_SET_RT_MODE,
		payload: isRT
	};
};
