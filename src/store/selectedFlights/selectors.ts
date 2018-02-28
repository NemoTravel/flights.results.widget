import { createSelector } from 'reselect';
import { ApplicationState, FareFamiliesCombinationsState, FlightsState, SelectedFlightsState } from '../../state';
import { getFlightsPool } from '../flights/selectors';
import Money from '../../schemas/Money';
import { getLegs } from '../currentLeg/selectors';
import Leg from '../../schemas/Leg';
import Flight from '../../schemas/Flight';
import { getFareFamiliesCombinations, getSelectedCombinations } from '../alternativeFlights/selectors';

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

export const getTotalPrice = createSelector(
	[getFlightsPool, getSelectedFlightsIds, isSelectionComplete, getSelectedCombinations, getFareFamiliesCombinations],
	(flightsPool: FlightsState, selectedFlightsIds: SelectedFlightsState, selectionComplete: boolean, selectedCombinations: string[], combinations: FareFamiliesCombinationsState): Money => {
		const totalPrice: Money = {
			amount: 0,
			currency: 'RUB'
		};

		if (selectionComplete) {
			selectedCombinations.forEach((combination, legId) => {
				if (combinations[legId].combinationsPrices.hasOwnProperty(combination)) {
					const price = combinations[legId].combinationsPrices[combination];
					totalPrice.amount += price.amount;
				}
			});
		}
		else {
			for (const legId in selectedFlightsIds) {
				if (selectedFlightsIds.hasOwnProperty(legId)) {
					const flightId = selectedFlightsIds[legId];

					if (flightsPool.hasOwnProperty(flightId)) {
						totalPrice.amount += flightsPool[flightId].totalPrice.amount;
					}
				}
			}
		}

		return totalPrice;
	}
);
