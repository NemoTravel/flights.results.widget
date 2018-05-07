import { AirportsFilterState } from '../../../state';
import {
	FilterAirportsAction,
	FILTERS_ADD_AIRPORT,
	FILTERS_REMOVE_AIRPORT,
	FILTERS_REMOVE_ALL_AIRPORTS
} from './actions';
import { addCodeInList, removeCodeFromList } from '../../../utils';
import { LocationType } from '../../../enums';

const initialAirportsFiltersState: AirportsFilterState = {
	[LocationType.Departure]: [],
	[LocationType.Arrival]: []
};

const airportsCodesListReducer = (state: string[], action: FilterAirportsAction): string[] => {
	switch (action.type) {
		case FILTERS_ADD_AIRPORT:
			return addCodeInList(state, action.payload);

		case FILTERS_REMOVE_AIRPORT:
			return removeCodeFromList(state, action.payload);
	}

	return state;
};

export const airportsFilterReducer = (state: AirportsFilterState = initialAirportsFiltersState, action: FilterAirportsAction): AirportsFilterState => {
	switch (action.type) {
		case FILTERS_REMOVE_ALL_AIRPORTS:
			return { ...state, departure: [], arrival: []};
	}

	return { ...state, [action.locationType]: airportsCodesListReducer(state[action.locationType], action) };
};
