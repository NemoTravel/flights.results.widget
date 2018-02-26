import { createSelector } from 'reselect';
import { ApplicationState, FlightsState, SelectedFlightsState } from '../../state';
import { getFlightsPool } from '../flights/selectors';
import Money from '../../schemas/Money';
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

export const getTotalPrice = createSelector(
	[getFlightsPool, getSelectedFlightsIds],
	(flightsPool: FlightsState, selectedFlightsIds: SelectedFlightsState): Money => {
		const totalPrice: Money = {
			amount: 0,
			currency: 'RUB'
		};

		for (const legId in selectedFlightsIds) {
			if (selectedFlightsIds.hasOwnProperty(legId)) {
				const flightId = selectedFlightsIds[legId];

				if (flightsPool.hasOwnProperty(flightId)) {
					totalPrice.amount += flightsPool[flightId].totalPrice.amount;
				}
			}
		}

		return totalPrice;
	}
);

export const isSelectionComplete = createSelector(
	[getLegs, getSelectedFlightsIds],
	(legs: Leg[], selectedFlightsIds: SelectedFlightsState) => {
		return !legs.find(leg => !selectedFlightsIds.hasOwnProperty(leg.id));
	}
);
