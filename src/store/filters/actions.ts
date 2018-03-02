import { CommonThunkAction } from '../../state';
import { setDirectFlights } from './directOnly/actions';
import { removeAllAirports } from './airports/actions';
import { removeAllAirlines } from './airlines/actions';
import { removeAllTimeIntervals } from './time/actions';

export const clearAllFilters = (): CommonThunkAction => {
	return dispatch => {
		dispatch(setDirectFlights(false));
		dispatch(removeAllAirports());
		dispatch(removeAllAirlines());
		dispatch(removeAllTimeIntervals());
	};
};
