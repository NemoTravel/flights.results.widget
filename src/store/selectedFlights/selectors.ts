import { createSelector } from 'reselect';
import { ApplicationState, FlightsState, SelectedFlightsState } from '../../state';
import { getAllFlights } from '../flights/selectors';
import { getLegs } from '../currentLeg/selectors';
import Leg from '../../schemas/Leg';
import Flight from '../../models/Flight';
import Money from '../../schemas/Money';
import { Currency } from '../../enums';

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

export const isRTSelected = createSelector(
	[getSelectedFlights],
	(flights: Flight[]): boolean => {
		return flights.length && !flights.find(flight => !flight.isRT);
	}
);

export const getTotalPriceOfOriginalSelectedFlights = createSelector(
	[getAllFlights, getSelectedFlightsIds],
	(allFlights: FlightsState, selectedFlightsIds: SelectedFlightsState): Money => {
		const result: Money = {
			amount: 0,
			currency: Currency.RUB
		};

		for (const legId in selectedFlightsIds) {
			if (selectedFlightsIds.hasOwnProperty(legId)) {
				const flightId = selectedFlightsIds[legId].originalFlightId;

				if (allFlights.hasOwnProperty(flightId)) {
					result.amount += allFlights[flightId].totalPrice.amount;
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
