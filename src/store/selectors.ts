import { createSelector } from 'reselect';
import Flight from '../schemas/Flight';
import { getFlightsIdsByLegs, ListOfSelectedCodes } from './filters/selectors';
import { getSelectedAirlinesList } from './filters/airlines/selectors';
import { getSelectedArrivalAirportsList, getSelectedDepartureAirportsList } from './filters/airports/selectors';
import { getIsDirectOnly } from './filters/directOnly/selectors';
import * as TimeFilter from './filters/time/selectors';
import { getFlightsForCurrentLeg, getFlightsPool } from './flights/selectors';
import * as Sorting from './sorting/selectors';
import * as State from '../state';
import Money from '../schemas/Money';
import { getCurrentLegId } from './currentLeg/selectors';
import * as AlternativeFlights from './alternativeFlights/selectors';
import { getSelectedFlights, getSelectedFlightsIds, isSelectionComplete } from './selectedFlights/selectors';
import { getFlightsRT } from './flightsRT/selectors';
import { FlightsRTState } from '../state';
import { UID_LEG_GLUE } from '../utils';

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

/**
 * Get a list of min prices for each leg.
 */
export const getMinPricesByLegs = createSelector(
	[getFlightsPool, getFlightsIdsByLegs],
	(flightsPool: State.FlightsState, flightsByLegs: State.FlightsByLegsState): PricesByLegs => {
		const result: PricesByLegs = {};

		for (const legId in flightsByLegs) {
			if (flightsByLegs.hasOwnProperty(legId)) {
				const flightsIds = flightsByLegs.hasOwnProperty(legId) ? flightsByLegs[legId] : [];

				result[legId] = flightsIds.map(flightId => flightsPool[flightId]).reduce(
					(minPrice: Money, flight: Flight): Money => {
						return (minPrice === null || flight.totalPrice.amount < minPrice.amount) ? flight.totalPrice : minPrice;
					},
				null);
			}
		}

		return result;
	}
);

/**
 * Get a list of min total possible prices for each leg.
 *
 * Example:
 * - leg 1 min price is $120
 * - leg 2 min price is $80
 * - leg 3 min price is $100
 *
 * Then:
 * - leg 1 min total possible price is $80 + $100 = 180$
 * - leg 2 min total possible price is $100
 * - leg 3 min total possible price is $0
 */
export const getMinTotalPossiblePricesByLegs = createSelector(
	[getMinPricesByLegs],
	(minPricesByLegs: PricesByLegs): PricesByLegs => {
		const result: PricesByLegs = {};

		for (const legId in minPricesByLegs) {
			if (minPricesByLegs.hasOwnProperty(legId)) {
				if (!result.hasOwnProperty(legId)) {
					result[legId] = { amount: 0, currency: 'RUB' };
				}

				// For each leg: loop through all next legs and sum up their min prices.
				for (const anotherLegId in minPricesByLegs) {
					if ((parseInt(anotherLegId)) > parseInt(legId) && minPricesByLegs.hasOwnProperty(anotherLegId)) {
						result[legId].amount += minPricesByLegs[anotherLegId].amount;
					}
				}
			}
		}

		return result;
	}
);

/**
 * Get an array of flights after filtering.
 */
export const getVisibleFlights = createSelector(
	[
		getFlightsForCurrentLeg,
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
 * Check if there are any visible flights for current leg.
 */
export const hasAnyVisibleFlights = createSelector(
	[getVisibleFlights],
	(flights: Flight[]): boolean => !!flights.length
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
		getMinTotalPossiblePricesByLegs,
		getCurrentLegId
	],
	(
		flightsPool: State.FlightsState,
		selectedFlightsIds: State.SelectedFlightsState,
		selectionComplete: boolean,
		selectedCombinations: AlternativeFlights.SelectedCombinations,
		combinations: State.FareFamiliesCombinationsState,
		minPricesByLegs: PricesByLegs,
		minTotalPossiblePricesByLegs: PricesByLegs,
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
		if (currentLegId !== 0 && !selectionComplete && minTotalPossiblePricesByLegs[currentLegId - 1]) {
			totalPrice.amount += minTotalPossiblePricesByLegs[currentLegId - 1].amount;
		}

		return totalPrice;
	}
);

export const getPricesForCurrentLeg = createSelector(
	[
		getFlightsForCurrentLeg,
		getMinPricesByLegs,
		getCurrentLegId,
		getFlightsRT,
		getSelectedFlights,
		getTotalPrice,
		getMinTotalPossiblePricesByLegs
	],
	(
		flightsForCurrentLeg: Flight[],
		minPricesByLegs: PricesByLegs,
		currentLegId: number,
		flightsRT: FlightsRTState,
		selectedFlights: Flight[],
		totalPrice: Money,
		minTotalPossiblePricesByLegs: PricesByLegs
	): PricesByFlights => {
		const result: PricesByFlights = {};
		const lowestPricesForNextLegs = minTotalPossiblePricesByLegs[currentLegId] ? minTotalPossiblePricesByLegs[currentLegId].amount : 0;
		const lowestPriceOnCurrentLeg = minPricesByLegs[currentLegId] ? minPricesByLegs[currentLegId].amount : 0;
		const totalPriceForSelectedFlights = selectedFlights.reduce((result: number, flight: Flight): number => flight.totalPrice.amount + result, 0);
		const selectedUID = selectedFlights.map(flight => flight.uid).join(UID_LEG_GLUE);

		flightsForCurrentLeg.forEach(flight => {
			let flightPrice = flight.totalPrice.amount;

			// Sometimes RT flight could be cheaper than OW+OW flight.
			// Loop through all RT flights and try to find one that is cheaper than currently selected combination.
			for (const uid in flightsRT) {
				if (flightsRT.hasOwnProperty(uid)) {
					const RTFlight: Flight = flightsRT[uid];
					const newUID = selectedUID ? `${selectedUID}|${flight.uid}` : flight.uid;
					const possibleTotalPrice = totalPriceForSelectedFlights + flightPrice + lowestPricesForNextLegs;

					// RT UID example: 'AY-720_1pc_AY-1071_1pc|AY-1076_1pc_AY-719_1pc'
					if (uid.startsWith(newUID) && RTFlight.totalPrice.amount < possibleTotalPrice) {
						flightPrice = RTFlight.totalPrice.amount ;
					}
				}
			}

			if (flightPrice === flight.totalPrice.amount) {
				// We haven't found any cheap RT flights :(
				result[flight.id] = {
					amount: flightPrice + (currentLegId === 0 ? lowestPricesForNextLegs : -(lowestPriceOnCurrentLeg)),
					currency: flight.totalPrice.currency
				};
			}
			else {
				// Hurray! We have found cheap RT flight:
				// let's calculate the difference in price between current selected flights and the RT one.
				result[flight.id] = {
					amount: totalPrice.amount - flightPrice,
					currency: flight.totalPrice.currency
				};
			}
		});

		return result;
	}
);
