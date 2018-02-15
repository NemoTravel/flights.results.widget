import Flight from '../../schemas/Flight';
import { SET_FLIGHTS, SetFlightsAction } from './actions';

export const flightsReducer = (state: Flight[] = [], action: SetFlightsAction): Flight[] => {
	switch (action.type) {
		case SET_FLIGHTS:
			return action.payload;
	}

	return state;
};
