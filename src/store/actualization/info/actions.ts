import AvailabilityInfo from '../../../schemas/AvailabilityInfo';

export const ACTUALIZATION_SET_INFO = 'ACTUALIZATION_SET_INFO';
export const ACTUALIZATION_CLEAR_INFO = 'ACTUALIZATION_CLEAR_INFO';

export type SetInfoAction = ReturnType<typeof setInfo>;

export const setInfo = (info: AvailabilityInfo[]) => {
	return {
		type: ACTUALIZATION_SET_INFO,
		payload: {
			info
		}
	};
};

export const clearInfo = () => {
	return {
		type: ACTUALIZATION_CLEAR_INFO
	};
};
