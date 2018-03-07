import { createSelector } from 'reselect';
import { ApplicationState, FlightsState, SelectedFlightsState } from '../../state';
import { getFlightsPool } from '../flights/selectors';
import { getLegs } from '../currentLeg/selectors';
import Leg from '../../schemas/Leg';
import Flight from '../../schemas/Flight';

export const getSelectedFlightsIds = (state: ApplicationState): SelectedFlightsState => state.selectedFlights;

export const getSelectedFlights = createSelector(
	[getFlightsPool, getSelectedFlightsIds],
	(flightsPool: FlightsState, selectedFlightsIds: SelectedFlightsState): Flight[] => {
		const result: Flight[] = [];

		for (const legId in selectedFlightsIds) {
			if (selectedFlightsIds.hasOwnProperty(legId)) {
				const flightId = selectedFlightsIds[legId];

				if (flightsPool.hasOwnProperty(flightId)) {
					result.push(flightsPool[flightId]);
				}
			}
		}

		return result;
	}
);

export const isSelectionComplete = createSelector(
	[getLegs, getSelectedFlightsIds],
	(legs: Leg[], selectedFlightsIds: SelectedFlightsState) => {
		return !legs.find(leg => !selectedFlightsIds.hasOwnProperty(leg.id));
	}
);
