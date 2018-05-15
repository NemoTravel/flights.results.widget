import { FILTERS_ADD_TIME, FILTERS_REMOVE_ALL_TIME, FILTERS_REMOVE_TIME, FilterTimeAction } from './actions';
import { addCodeInList, removeCodeFromList } from '../../../utils';
import { FlightTimeInterval, LocationType } from '../../../enums';

export interface TimeFilterState {
	[LocationType.Arrival]: FlightTimeInterval[];
	[LocationType.Departure]: FlightTimeInterval[];
}

const initialTimeFiltersState: TimeFilterState = {
	[LocationType.Departure]: [],
	[LocationType.Arrival]: []
};

const timesListReducer = (state: string[], action: FilterTimeAction): string[] => {
	switch (action.type) {
		case FILTERS_ADD_TIME:
			return addCodeInList(state, action.payload);

		case FILTERS_REMOVE_TIME:
			return removeCodeFromList(state, action.payload);
	}

	return state;
};

export const timeFilterReducer = (state: TimeFilterState = initialTimeFiltersState, action: FilterTimeAction): TimeFilterState => {
	switch (action.type) {
		case FILTERS_REMOVE_ALL_TIME:
			return { ...state, departure: [], arrival: []};
	}

	return { ...state, [action.locationType]: timesListReducer(state[action.locationType], action) };
};
