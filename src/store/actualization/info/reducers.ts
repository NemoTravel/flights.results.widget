import { Action } from 'redux';
import AvailabilityInfo from '../../../schemas/AvailabilityInfo';
import { ACTUALIZATION_CLEAR_INFO, ACTUALIZATION_SET_INFO, SetInfoAction } from './actions';

export const infoReducer = (state: AvailabilityInfo[] = [], action: SetInfoAction|Action): AvailabilityInfo[] => {
	switch (action.type) {
		case ACTUALIZATION_SET_INFO:
			return (action as SetInfoAction).payload.info;

		case ACTUALIZATION_CLEAR_INFO:
			return [];
	}

	return state;
};
