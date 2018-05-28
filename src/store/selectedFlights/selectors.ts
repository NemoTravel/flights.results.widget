import { createSelector } from 'reselect';
import { FlightsState } from '../flights/reducers';
import { getAllFlights } from '../flights/selectors';
import { getLegs } from '../legs/selectors';
import Leg from '../../schemas/Leg';
import Flight from '../../models/Flight';
import { RootState } from '../reducers';
import { SelectedFlightsState } from './reducers';

export const getSelectedFlightsIds = (state: RootState): SelectedFlightsState => state.selectedFlights;

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

export const getTotalPriceOfSelectedFlights = createSelector(
	[getSelectedFlights],
	(selectedFlights: Flight[]): number => {
		const map: { [flightId: string]: boolean } = {};
		let result = 0;

		selectedFlights.forEach(flight => {
			// Do not sum up same flights (RT flights case).
			if (!map.hasOwnProperty(flight.id)) {
				result += flight.totalPrice.amount;
				map[flight.id] = true;
			}
		});

		return result;
	}
);
