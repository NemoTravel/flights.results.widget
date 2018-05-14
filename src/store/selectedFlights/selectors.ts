import { createSelector } from 'reselect';
import { ApplicationState, FlightsState, SelectedFlightsState } from '../../state';
import { getAllFlights } from '../flights/selectors';
import { getLegs } from '../currentLeg/selectors';
import Leg from '../../schemas/Leg';
import Flight from '../../models/Flight';

export const getSelectedFlightsIds = (state: ApplicationState): SelectedFlightsState => state.selectedFlights;

export const getSelectedFlights = createSelector(
	[getAllFlights, getSelectedFlightsIds],
	(allFlights: FlightsState, selectedFlightsIds: SelectedFlightsState): Flight[] => {
		const result: Flight[] = [];

		for (const legId in selectedFlightsIds) {
			if (selectedFlightsIds.hasOwnProperty(legId)) {
				const flightId = selectedFlightsIds[legId].newFlightId;

				if (allFlights.hasOwnProperty(flightId)) {
					result.push(allFlights[flightId]);
				}
			}
		}

		return result;
	}
);

export const isSelectionComplete = createSelector(
	[getLegs, getSelectedFlightsIds],
	(legs: Leg[], selectedFlightsIds: SelectedFlightsState) => {
		return !!legs.length && !legs.find(leg => !selectedFlightsIds.hasOwnProperty(leg.id));
	}
);
