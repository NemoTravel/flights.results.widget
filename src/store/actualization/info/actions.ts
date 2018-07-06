import AvailabilityInfo from '../../../schemas/AvailabilityInfo';

export const ACTUALIZATION_SET_INFO = 'ACTUALIZATION_SET_INFO';

export type SetInfoAction = ReturnType<typeof setInfo>;

export const setInfo = (info: AvailabilityInfo[]) => {
	return {
		type: ACTUALIZATION_SET_INFO,
		payload: {
			info
		}
	};
};
