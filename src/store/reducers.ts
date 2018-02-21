import { combineReducers } from 'redux';
import { ApplicationState } from '../state';
import { flightsByLegsReducer } from './flightsByLegs/reducers';
import { loadingReducer } from './isLoading/reducers';
import { configReducer } from './config/reducers';
import { filtersReducer } from './filters/reducers';
import { currentLegReducer } from './currentLeg/reducers';
import { selectedFlightsReducer } from './selectedFlights/reducers';
import Leg from '../schemas/Leg';
import * as moment from 'moment';

const initialLegsState = [
	{
		id: 0,
		date: moment('2018-06-24').locale('ru'),
		departure: 'Саратов',
		arrival: 'Москва'
	},
	{
		id: 1,
		date: moment('2018-06-25').locale('ru'),
		departure: 'Москва',
		arrival: 'Санкт-Петербург'
	}
];

export const rootReducer = combineReducers<ApplicationState>({
	isLoading: loadingReducer,
	flightsByLegs: flightsByLegsReducer,
	filters: filtersReducer,
	config: configReducer,
	currentLeg: currentLegReducer,
	selectedFligts: selectedFlightsReducer,
	legs: (state: Leg[] = initialLegsState): Leg[] => state
});
