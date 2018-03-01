import * as moment from 'moment';
import { combineReducers } from 'redux';

import Leg from '../schemas/Leg';
import { ApplicationState } from '../state';
import { flightsByLegsReducer } from './flightsByLegs/reducers';
import { loadingReducer } from './isLoading/reducers';
import { configReducer } from './config/reducers';
import { filtersReducer } from './filters/reducers';
import { currentLegReducer } from './currentLeg/reducers';
import { selectedFlightsReducer } from './selectedFlights/reducers';
import { flightsReducer } from './flights/reducers';
import { alternativeFlightsReducer } from './alternativeFlights/reducers';
import { sortingReducer } from './sorting/reducers';

const initialLegsState = [
	{
		id: 0,
		date: moment('2018-06-22').locale('ru'),
		departure: 'Москва',
		arrival: 'Санкт-Петербург'
	},
	{
		id: 1,
		date: moment('2018-06-22').locale('ru'),
		departure: 'Санкт-Петербург',
		arrival: 'Мадрид'
	}
];

export const rootReducer = combineReducers<ApplicationState>({
	isLoading: loadingReducer,
	flights: flightsReducer,
	flightsByLegs: flightsByLegsReducer,
	filters: filtersReducer,
	config: configReducer,
	currentLeg: currentLegReducer,
	selectedFlights: selectedFlightsReducer,
	alternativeFlights: alternativeFlightsReducer,
	sorting: sortingReducer,
	legs: (state: Leg[] = initialLegsState): Leg[] => state
});
