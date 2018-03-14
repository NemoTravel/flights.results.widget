import { createSelector } from 'reselect';
import Flight from '../schemas/Flight';
import { getFlightsIdsByLegs, ListOfSelectedCodes } from './filters/selectors';
import { getSelectedAirlinesList } from './filters/airlines/selectors';
import { getSelectedArrivalAirportsList, getSelectedDepartureAirportsList } from './filters/airports/selectors';
import { getIsDirectOnly } from './filters/directOnly/selectors';
import * as TimeFilter from './filters/time/selectors';
import { getFlights, getFlightsPool } from './flights/selectors';
import * as Sorting from './sorting/selectors';
import * as State from '../state';
import Money from '../schemas/Money';
import { getCurrentLegId } from './currentLeg/selectors';
import * as AlternativeFlights from './alternativeFlights/selectors';
import { getSelectedFlightsIds, isSelectionComplete } from './selectedFlights/selectors';

const sortingFunctionsMap: { [type: string]: (a: Flight, b: Flight, direction: State.SortingDirection) => number } = {
	[State.SortingType.Price]: Sorting.priceCompareFunction,
	[State.SortingType.FlightTime]: Sorting.flightTimeCompareFunction,
	[State.SortingType.DepartureTime]: Sorting.departureTimeCompareFunction,
	[State.SortingType.ArrivalTime]: Sorting.arrivalTimeCompareFunction
};

export interface PricesByFlights {
	[flightId: number]: Money;
}

interface PricesByLegs {
	[legId: number]: Money;
}

const getPriceForLeg = (legId: number, pricesByLeg: { [legId: number]: Money }): Money => {
	const price: Money = { amount: 0, currency: 'RUB' };

	for (const priceLegId in pricesByLeg) {
		if ((parseInt(priceLegId)) > legId && pricesByLeg.hasOwnProperty(priceLegId)) {
			price.amount += pricesByLeg[priceLegId].amount;
		}
	}

	return price;
};

export const getMinPricesByLegs = createSelector(
	[getFlightsPool, getFlightsIdsByLegs],
	(allFlights: State.FlightsState, flightsByLegs: State.FlightsByLegsState): PricesByLegs => {
		const result: PricesByLegs = {};

		for (const legId in flightsByLegs) {
			if (flightsByLegs.hasOwnProperty(legId)) {
				const flightsIds = flightsByLegs.hasOwnProperty(legId) ? flightsByLegs[legId] : [];
				const flights = flightsIds.map(flightId => allFlights[flightId]);

				result[legId] = flights.reduce((minPrice: Money, flight: Flight) => {
					return (minPrice === null || flight.totalPrice.amount < minPrice.amount) ? flight.totalPrice : minPrice;
				}, null);
			}
		}

		return result;
	}
);

export const getPricesForCurrentLeg = createSelector(
	[getFlights, getMinPricesByLegs, getCurrentLegId],
	(flights: Flight[], minPricesByLegs: PricesByLegs, currentLegId: number): PricesByFlights => {
		const result: PricesByFlights = {};
		const priceDiff = currentLegId === 0 ? -getPriceForLeg(currentLegId, minPricesByLegs).amount : minPricesByLegs[currentLegId].amount;

		flights.forEach(flight => {
			result[flight.id] = {
				amount: flight.totalPrice.amount - priceDiff,
				currency: flight.totalPrice.currency
			};
		});

		return result;
	}
);

/**
 * Get an array of flights after filtering.
 */
export const getVisibleFlights = createSelector(
	[
		getFlights,
		getSelectedAirlinesList,
		getSelectedDepartureAirportsList,
		getSelectedArrivalAirportsList,
		TimeFilter.getSelectedDepartureTimeIntervals,
		TimeFilter.getSelectedArrivalTimeIntervals,
		getIsDirectOnly,
		Sorting.getCurrentSorting
	],
	(
		flights: Flight[],
		selectedAirlines: ListOfSelectedCodes,
		selectedDepartureAirports: ListOfSelectedCodes,
		selectedArrivalAirports: ListOfSelectedCodes,
		selectedDepartureTimeIntervals: ListOfSelectedCodes,
		selectedArrivalTimeIntervals: ListOfSelectedCodes,
		directOnly: boolean,
		sorting: State.SortingState
	): Flight[] => {
		let newFlights = flights.filter(flight => {
			const firstSegment = flight.segments[0];
			const lastSegment = flight.segments[flight.segments.length - 1];

			if (directOnly && flight.segments.length !== 1) {
				return false;
			}

			if (Object.keys(selectedDepartureAirports).length && !(firstSegment.depAirport.IATA in selectedDepartureAirports)) {
				return false;
			}

			if (Object.keys(selectedArrivalAirports).length && !(lastSegment.arrAirport.IATA in selectedArrivalAirports)) {
				return false;
			}

			if (Object.keys(selectedAirlines).length && !flight.segments.find(segment => segment.airline.IATA in selectedAirlines)) {
				return false;
			}

			if (Object.keys(selectedDepartureTimeIntervals).length && !(TimeFilter.getTimeIntervalForDate(firstSegment.depDate) in selectedDepartureTimeIntervals)) {
				return false;
			}

			if (Object.keys(selectedArrivalTimeIntervals).length && !(TimeFilter.getTimeIntervalForDate(lastSegment.arrDate) in selectedArrivalTimeIntervals)) {
				return false;
			}

			return true;
		});

		newFlights = newFlights.sort((a, b) => sortingFunctionsMap[sorting.type](a, b, sorting.direction));

		return newFlights;
	}
);

/**
 * Calculating total price.
 */
export const getTotalPrice = createSelector(
	[
		getFlightsPool,
		getSelectedFlightsIds,
		isSelectionComplete,
		AlternativeFlights.getSelectedCombinations,
		AlternativeFlights.getFareFamiliesCombinations,
		getMinPricesByLegs,
		getCurrentLegId
	],
	(
		flightsPool: State.FlightsState,
		selectedFlightsIds: State.SelectedFlightsState,
		selectionComplete: boolean,
		selectedCombinations: AlternativeFlights.SelectedCombinations,
		combinations: State.FareFamiliesCombinationsState,
		minPricesByLegs: PricesByLegs,
		currentLegId: number
	): Money => {
		const totalPrice: Money = {
			amount: 0,
			currency: 'RUB'
		};

		// Loop through selected flights ids.
		for (const legId in selectedFlightsIds) {
			if (selectedFlightsIds.hasOwnProperty(legId)) {
				const flightId = selectedFlightsIds[legId];

				// If main flights have been successfully selected,
				// then it's time to choose alternative flights (fare families).
				if (selectionComplete && selectedCombinations[legId] && combinations[legId]) {
					const combination = selectedCombinations[legId];

					// Check if selected fare families combination is valid and has its own price.
					if (combinations[legId].combinationsPrices.hasOwnProperty(combination)) {
						totalPrice.amount += combinations[legId].combinationsPrices[combination].amount;
					}
				}
				else {
					// Get flight and add its price to the total sum.
					if (flightsPool.hasOwnProperty(flightId)) {
						totalPrice.amount += flightsPool[flightId].totalPrice.amount;
					}
				}
			}
		}

		// Some cheating, allowing us to show relative prices on the go.
		if (currentLegId !== 0 && !selectionComplete) {
			totalPrice.amount += getPriceForLeg(currentLegId - 1, minPricesByLegs).amount;
		}

		return totalPrice;
	}
);
