import { createSelector } from 'reselect';
import Flight from '../schemas/Flight';
import { getFlightsIdsByLegs, ListOfSelectedCodes } from './filters/selectors';
import { getSelectedAirlinesList } from './filters/airlines/selectors';
import { getSelectedArrivalAirportsList, getSelectedDepartureAirportsList } from './filters/airports/selectors';
import { getIsDirectOnly } from './filters/directOnly/selectors';
import {
	getSelectedArrivalTimeIntervals,
	getSelectedDepartureTimeIntervals,
	getTimeIntervalForDate
} from './filters/time/selectors';
import { getFlights, getFlightsPool } from './flights/selectors';
import {
	arrivalTimeCompareFunction,
	departureTimeCompareFunction,
	flightTimeCompareFunction,
	getCurrentSorting,
	priceCompareFunction
} from './sorting/selectors';
import {
	FareFamiliesCombinationsState,
	FlightsByLegsState,
	FlightsState,
	SelectedFlightsState,
	SortingDirection,
	SortingState,
	SortingType
} from '../state';
import Money from '../schemas/Money';
import { getCurrentLegId } from './currentLeg/selectors';
import {
	getFareFamiliesCombinations, getSelectedCombinations,
	SelectedCombinations
} from './alternativeFlights/selectors';
import { getSelectedFlightsIds, isSelectionComplete } from './selectedFlights/selectors';

const sortingFunctionsMap: { [type: string]: (a: Flight, b: Flight, direction: SortingDirection) => number } = {
	[SortingType.Price]: priceCompareFunction,
	[SortingType.FlightTime]: flightTimeCompareFunction,
	[SortingType.DepartureTime]: departureTimeCompareFunction,
	[SortingType.ArrivalTime]: arrivalTimeCompareFunction
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
	(allFlights: FlightsState, flightsByLegs: FlightsByLegsState): PricesByLegs => {
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
		getSelectedDepartureTimeIntervals,
		getSelectedArrivalTimeIntervals,
		getIsDirectOnly,
		getCurrentSorting
	],
	(
		flights: Flight[],
		selectedAirlines: ListOfSelectedCodes,
		selectedDepartureAirports: ListOfSelectedCodes,
		selectedArrivalAirports: ListOfSelectedCodes,
		selectedDepartureTimeIntervals: ListOfSelectedCodes,
		selectedArrivalTimeIntervals: ListOfSelectedCodes,
		directOnly: boolean,
		sorting: SortingState
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

			if (Object.keys(selectedDepartureTimeIntervals).length && !(getTimeIntervalForDate(firstSegment.depDate) in selectedDepartureTimeIntervals)) {
				return false;
			}

			if (Object.keys(selectedArrivalTimeIntervals).length && !(getTimeIntervalForDate(lastSegment.arrDate) in selectedArrivalTimeIntervals)) {
				return false;
			}

			return true;
		});

		newFlights = newFlights.sort((a, b) => {
			return sortingFunctionsMap[sorting.type](a, b, sorting.direction);
		});

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
		getSelectedCombinations,
		getFareFamiliesCombinations,
		getMinPricesByLegs,
		getCurrentLegId
	],
	(
		flightsPool: FlightsState,
		selectedFlightsIds: SelectedFlightsState,
		selectionComplete: boolean,
		selectedCombinations: SelectedCombinations,
		combinations: FareFamiliesCombinationsState,
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
					const flightId = selectedFlightsIds[legId];

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
