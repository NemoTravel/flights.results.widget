import { createSelector } from 'reselect';
import Flight from '../models/Flight';
import { getListOfSelectedCodes, ListOfSelectedCodes } from './filters/selectors';
import { getAllFlights, getFlightsForCurrentLeg } from './flights/selectors';
import * as Sorting from './sorting/selectors';
import { sortingFunctionsMap } from './sorting/selectors';
import { FlightsRTState } from './flightsRT/reducers';
import Money from '../schemas/Money';
import { getCurrentLegId, isFirstLeg, isLastLeg } from './currentLeg/selectors';
import * as FareFamilies from './fareFamilies/selectors';
import {
	getAirlinesIATA,
	getSelectedFlights,
	getSelectedFlightsIds,
	getTotalPriceOfSelectedFlights,
	isSelectionComplete
} from './selectedFlights/selectors';
import { getFlightsRT } from './flightsRT/selectors';
import { MAX_VISIBLE_FLIGHTS, UID_LEG_GLUE } from '../utils';
import { Currency, Route } from '../enums';
import { FlightsReplacement } from '../schemas/SelectedFlight';
import { FlightsByLegsState } from './flightsByLegs/reducers';
import { SelectedFlightsState } from './selectedFlights/reducers';
import { FlightsState } from './flights/reducers';
import { SortingState } from './sorting/reducers';
import { FareFamiliesCombinationsState } from './fareFamilies/fareFamiliesCombinations/reducers';
import { getShowAllFlights } from './showAllFlights/selectors';
import {
	getFilteredArrivalTimeIntervals, getFilteredDepartureTimeIntervals,
	getTimeIntervalForDate
} from './filters/time/selectors';
import { RootState } from './reducers';
import { getFilteredArrivalAirports, getFilteredDepartureAirports } from './filters/airports/selectors';
import { getFilteredAirlines } from './filters/airlines/selectors';
import { getFlightsIdsByLegs } from './flightsByLegs/selectors';
import { getIsRTMode } from './fareFamilies/isRTMode/selectors';
import { CombinationsPrices } from '../schemas/FareFamiliesCombinations';
import { getCurrency } from './currency/selectors';

export interface PricesByFlights {
	[flightId: string]: Money;
}

interface PricesByLegs {
	[legId: number]: Money;
}

export interface FlightsVisibility {
	[flightId: string]: boolean;
}

export interface FilterSelectors {
	selectedAirlines: ListOfSelectedCodes;
	selectedDepartureAirports: ListOfSelectedCodes;
	selectedArrivalAirports: ListOfSelectedCodes;
	selectedDepartureTimeIntervals: ListOfSelectedCodes;
	selectedArrivalTimeIntervals: ListOfSelectedCodes;
	directOnly: boolean;
	flightSearch: string;
	comfortable: boolean
}

/**
 * Get a list of min prices for each leg.
 */
export const getMinPricesByLegs = createSelector(
	[getAllFlights, getFlightsIdsByLegs, getCurrency],
	(flightsPool: FlightsState, flightsByLegs: FlightsByLegsState, currency: Currency): PricesByLegs => {
		const result: PricesByLegs = {};

		for (const legId in flightsByLegs) {
			if (flightsByLegs.hasOwnProperty(legId)) {
				const flightsIds = flightsByLegs.hasOwnProperty(legId) ? flightsByLegs[legId] : [];
				const flights: Flight[] = [];

				flightsIds.forEach(flightId => {
					if (flightsPool.hasOwnProperty(flightId)) {
						flights.push(flightsPool[flightId]);
					}
				});

				if (flights.length) {
					let minPrice: Money = null;

					flights.forEach(flight => {
						minPrice = (minPrice === null || flight.totalPrice.amount < minPrice.amount) ? flight.totalPrice : minPrice;
					});

					result[legId] = minPrice;
				}
				else {
					result[legId] = {
						amount: 0,
						currency: currency
					};
				}
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
	[getMinPricesByLegs, getCurrency],
	(minPricesByLegs: PricesByLegs, currency: Currency): PricesByLegs => {
		const result: PricesByLegs = {};

		for (const legId in minPricesByLegs) {
			if (minPricesByLegs.hasOwnProperty(legId)) {
				if (!result.hasOwnProperty(legId)) {
					result[legId] = { amount: 0, currency: currency };
				}

				// For each leg: loop through all next legs and sum up their min prices.
				for (const anotherLegId in minPricesByLegs) {
					if (minPricesByLegs.hasOwnProperty(anotherLegId) && (parseInt(anotherLegId) > parseInt(legId))) {
						result[legId].amount += minPricesByLegs[anotherLegId].amount;
					}
				}
			}
		}

		return result;
	}
);

/**
 * Check if there are any transfer flights.
 */
export const hasAnyTransferFlights = createSelector(
	[getFlightsForCurrentLeg],
	(flights: Flight[]): boolean => {
		const numOfTransferFlights = flights.filter(flight => flight.segments.length > 1).length;

		return numOfTransferFlights > 1 && numOfTransferFlights !== flights.length;
	}
);

/**
 * Calculating total price.
 */
export const getTotalPrice = createSelector(
	[
		getAllFlights,
		getSelectedFlightsIds,
		isSelectionComplete,
		FareFamilies.getSelectedCombinations,
		FareFamilies.getFareFamiliesCombinations,
		getMinPricesByLegs,
		getMinTotalPossiblePricesByLegs,
		getIsRTMode,
		getCurrency
	],
	(
		allFlights: FlightsState,
		selectedFlightsIds: SelectedFlightsState,
		selectionComplete: boolean,
		selectedCombinations: FareFamilies.SelectedCombinations,
		combinations: FareFamiliesCombinationsState,
		minPricesByLegs: PricesByLegs,
		minTotalPossiblePricesByLegs: PricesByLegs,
		isRTMode: boolean,
		currency: Currency
	): Money => {
		let RTFound = false;
		const totalPrice: Money = {
			amount: 0,
			currency: currency
		};

		if (selectionComplete && isRTMode) {
			let prices: CombinationsPrices;
			const combinationsParts: string[] = [];

			for (const legId in selectedFlightsIds) {
				if (selectedFlightsIds.hasOwnProperty(legId)) {
					if (selectedCombinations[legId] && combinations[legId]) {
						if (!prices) {
							prices = combinations[legId].combinationsPrices;
						}

						combinationsParts.push(selectedCombinations[legId]);
					}
				}
			}

			const resultingCombination = combinationsParts.join('_');

			if (prices && prices.hasOwnProperty(resultingCombination)) {
				totalPrice.amount = prices[resultingCombination].amount;
			}
		}
		else {
			for (const legId in selectedFlightsIds) {
				if (selectedFlightsIds.hasOwnProperty(legId)) {
					const intLegId = parseInt(legId);
					const flightId = selectedFlightsIds[legId].newFlightId;

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
						if (allFlights.hasOwnProperty(flightId)) {
							const flight = allFlights[flightId];

							if (!RTFound) {
								totalPrice.amount += flight.totalPrice.amount;
							}

							if (flight.isRT || flight.id.indexOf('/') !== -1) {
								RTFound = true;
							}
						}
					}

					if (!RTFound && !selectionComplete && minTotalPossiblePricesByLegs[intLegId]) {
						totalPrice.amount += minTotalPossiblePricesByLegs[intLegId].amount;
					}
				}
			}
		}

		return totalPrice;
	}
);

export const getPricesForCurrentLeg = createSelector(
	[
		getFlightsForCurrentLeg,
		getFlightsRT,
		isLastLeg,
		getSelectedFlights,
		getTotalPriceOfSelectedFlights
	],
	(
		flights: Flight[],
		flightsRT: FlightsRTState,
		isLastLeg: boolean,
		selectedFlights: Flight[],
		totalPriceOfSelectedFlights: number
	): FlightsReplacement => {
		const result: FlightsReplacement = {};
		const selectedUID = selectedFlights.map(flight => flight.uid).join(UID_LEG_GLUE);

		flights.forEach(flight => {
			let newFlightId = flight.id;
			let price = flight.totalPrice;
			let isRT = false;
			const candidateUID = selectedUID ? `${selectedUID}|${flight.uid}` : flight.uid;
			const possibleTotalPrice = totalPriceOfSelectedFlights + price.amount;
			const originalFlightId = flight.id;

			if (isLastLeg) {
				// Sometimes RT flight could be cheaper than OW+OW flight.
				// Loop through all RT flights and try to find one that is cheaper than currently selected combination.
				for (const uid in flightsRT) {
					if (flightsRT.hasOwnProperty(uid)) {
						const RTFlight: Flight = flightsRT[uid];

						// RT UID example: 'AY-720_1pc_AY-1071_1pc|AY-1076_1pc_AY-719_1pc'
						if (uid.startsWith(candidateUID) && RTFlight.totalPrice.amount < possibleTotalPrice) {
							price = RTFlight.totalPrice;
							newFlightId = RTFlight.id;
							isRT = true;
							break;
						}
					}
				}
			}

			result[flight.id] = {
				price,
				isRT,
				originalFlightId,
				newFlightId
			};
		});

		return result;
	}
);

export const getRelativePrices = createSelector(
	[
		getAllFlights,
		getPricesForCurrentLeg,
		getMinPricesByLegs,
		getTotalPrice,
		getMinTotalPossiblePricesByLegs,
		getCurrentLegId
	],
	(
		allFlights: FlightsState,
		prices: FlightsReplacement,
		minPrices: PricesByLegs,
		totalPrice: Money,
		minTotalPossiblePricesByLegs: PricesByLegs,
		legId: number
	): FlightsReplacement => {
		const minPriceOnCurrentLeg = minPrices[legId] ? minPrices[legId].amount : 0;
		const minTotalPriceForNextLegs = minTotalPossiblePricesByLegs[legId] ? minTotalPossiblePricesByLegs[legId].amount : 0;
		const result: FlightsReplacement = {};

		for (const flightId in prices) {
			if (prices.hasOwnProperty(flightId) && allFlights.hasOwnProperty(flightId)) {
				const priceCandidate = prices[flightId];
				let amount: number;

				if (priceCandidate.isRT) {
					// Hurray! We have found cheap RT flight.
					amount = priceCandidate.price.amount - totalPrice.amount;
				}
				else {
					// We haven't found any cheap RT flights :(
					amount = priceCandidate.price.amount + (legId === 0 ? minTotalPriceForNextLegs : -(minPriceOnCurrentLeg));
				}

				result[flightId] = {
					...priceCandidate,
					price: {
						amount,
						currency: priceCandidate.price.currency
					}
				};
			}
		}

		return result;
	}
);

export const getTotalPrices = createSelector(
	[isLastLeg, isFirstLeg, getTotalPrice, getRelativePrices],
	(isLastLeg: boolean, isFirstLeg: boolean, totalPrice: Money, relativePrices: FlightsReplacement): PricesByFlights => {
		const result: PricesByFlights = {};

		if (isLastLeg && !isFirstLeg) {
			for (const flightId in relativePrices) {
				if (relativePrices.hasOwnProperty(flightId)) {
					result[flightId] = {
						amount: totalPrice.amount + relativePrices[flightId].price.amount,
						currency: totalPrice.currency
					};
				}
			}
		}

		return result;
	}
);

export const getPricesForSelectedFlights = createSelector(
	[getSelectedFlights, getMinPricesByLegs, getMinTotalPossiblePricesByLegs],
	(flights: Flight[], minPrices: PricesByLegs, minTotalPossiblePricesByLegs: PricesByLegs): FlightsReplacement => {
		const result: FlightsReplacement = {};

		flights.forEach(flight => {
			const legId = flight.legId;
			const minPriceOnCurrentLeg = minPrices[legId] ? minPrices[legId].amount : 0;
			const minTotalPriceForNextLegs = minTotalPossiblePricesByLegs[legId] ? minTotalPossiblePricesByLegs[legId].amount : 0;

			result[flight.id] = {
				newFlightId: flight.id,
				originalFlightId: flight.id,
				isRT: flight.isRT,
				price: {
					amount: flight.totalPrice.amount + (legId === 0 ? minTotalPriceForNextLegs : -(minPriceOnCurrentLeg)),
					currency: flight.totalPrice.currency
				}
			};
		});

		return result;
	}
);

export const getSelectedAirlinesList = createSelector([getFilteredAirlines], getListOfSelectedCodes);

export const getSelectedDepartureAirportsList = createSelector([getFilteredDepartureAirports], getListOfSelectedCodes);
export const getSelectedArrivalAirportsList = createSelector([getFilteredArrivalAirports], getListOfSelectedCodes);

export const getSelectedDepartureTimeIntervals = createSelector([getFilteredDepartureTimeIntervals], getListOfSelectedCodes);
export const getSelectedArrivalTimeIntervals = createSelector([getFilteredArrivalTimeIntervals], getListOfSelectedCodes);

export const getIsDirectOnly = (state: RootState): boolean => state.filters.directOnly;
export const getFlightSearch = (state: RootState): string => state.filters.flightSearch.search;
export const getIsComfortable = (state: RootState): boolean => state.filters.comfortable;

export const filtersConfig = createSelector(
	[
		getSelectedAirlinesList,
		getSelectedDepartureAirportsList,
		getSelectedArrivalAirportsList,
		getSelectedDepartureTimeIntervals,
		getSelectedArrivalTimeIntervals,
		getIsDirectOnly,
		getFlightSearch,
		getIsComfortable
	],
	(
		selectedAirlines: ListOfSelectedCodes,
		selectedDepartureAirports: ListOfSelectedCodes,
		selectedArrivalAirports: ListOfSelectedCodes,
		selectedDepartureTimeIntervals: ListOfSelectedCodes,
		selectedArrivalTimeIntervals: ListOfSelectedCodes,
		directOnly: boolean,
		flightSearch: string,
		comfortable: boolean
	) => {
		return {
			selectedAirlines,
			selectedDepartureAirports,
			selectedArrivalAirports,
			selectedDepartureTimeIntervals,
			selectedArrivalTimeIntervals,
			directOnly,
			flightSearch,
			comfortable
		};
	}
);

/**
 * Get an array of flights after filtering.
 */
export const getFilteredFlights = createSelector(
	[
		getFlightsForCurrentLeg,
		getSelectedFlights,
		filtersConfig
	],
	(
		flights: Flight[],
		selectedFlights: Flight[],
		{
			selectedAirlines,
			selectedDepartureAirports,
			selectedArrivalAirports,
			selectedDepartureTimeIntervals,
			selectedArrivalTimeIntervals,
			directOnly,
			flightSearch,
			comfortable
		}: FilterSelectors
	): Flight[] => {
		const
			selectedAirlineCodes = comfortable ? getAirlinesIATA(selectedFlights) : {},
			lastSegmentArrAirportIATA = comfortable ? selectedFlights[selectedFlights.length - 1].lastSegment.arrAirport.IATA : null;

		return flights.filter(flight => {
			const firstSegment = flight.segments[0];
			const lastSegment = flight.segments[flight.segments.length - 1];

			// Filter direct flights.
			if (directOnly && flight.segments.length !== 1) {
				return false;
			}

			// Filter by searchIndex.
			if (flightSearch && flight.searchIndex.indexOf(flightSearch.toLowerCase()) === -1) {
				return false;
			}

			// Filter by departure airport.
			if (Object.keys(selectedDepartureAirports).length && !(firstSegment.depAirport.IATA in selectedDepartureAirports)) {
				return false;
			}

			// Filter by arrival airport.
			if (Object.keys(selectedArrivalAirports).length && !(lastSegment.arrAirport.IATA in selectedArrivalAirports)) {
				return false;
			}

			// Filter by airline.
			if (Object.keys(selectedAirlines).length && !flight.segments.find(segment => segment.airline.IATA in selectedAirlines)) {
				return false;
			}

			// Filter by departure time.
			if (Object.keys(selectedDepartureTimeIntervals).length && !(getTimeIntervalForDate(firstSegment.depDate) in selectedDepartureTimeIntervals)) {
				return false;
			}

			// Filter by arrival time.
			if (Object.keys(selectedArrivalTimeIntervals).length && !(getTimeIntervalForDate(lastSegment.arrDate) in selectedArrivalTimeIntervals)) {
				return false;
			}

			// Show only `comfortable` flight if checked.
			if (comfortable) {
				if (lastSegmentArrAirportIATA !== flight.firstSegment.depAirport.IATA) {
					return false;
				}

				return flight.segments.find(segment => {
					if (selectedAirlineCodes.hasOwnProperty(segment.airline.IATA)) {
						return true;
					}
				});
			}

			return true;
		});
	}
);

export const getSortedFlights = createSelector(
	[getFlightsForCurrentLeg, Sorting.getCurrentSorting, getRelativePrices],
	(flights: Flight[], sorting: SortingState, prices: FlightsReplacement): Flight[] => {
		return flights.slice().sort((a, b) => sortingFunctionsMap[sorting.type](a, b, sorting.direction, prices));
	}
);

export const getVisibleFlights = createSelector(
	[getFilteredFlights, getShowAllFlights],
	(flights: Flight[], showAllFlights: boolean): Flight[] => {
		let results = flights;

		if (!showAllFlights) {
			results = flights.slice(0, MAX_VISIBLE_FLIGHTS);
		}

		return results;
	}
);

export const getVisibleFlightsMap = createSelector(
	[getVisibleFlights],
	(flights: Flight[]) => {
		const result: FlightsVisibility = {};

		flights.forEach(flight => {
			result[flight.id] = true;
		});

		return result;
	}
);

/**
 * Check if there are any visible flights for current leg.
 */
export const hasAnyVisibleFlights = createSelector(
	[getVisibleFlights],
	(flights: Flight[]): boolean => !!flights.length
);

export const hasHiddenFlights = createSelector(
	[getShowAllFlights, getFlightsForCurrentLeg, getVisibleFlights],
	(showAllFlights: boolean, allFlights: Flight[], visibleFlights: Flight[]): boolean => {
		return !showAllFlights && allFlights.length > MAX_VISIBLE_FLIGHTS && !(visibleFlights.length < MAX_VISIBLE_FLIGHTS);
	}
);

export const getRouterLocation = (state: RootState) => state.router.location.pathname;

export const getRoute = createSelector(
	[getRouterLocation],
	(location: string): Route => {
		if (/\/results\/(\d+\/?)+/.test(location)) {
			return Route.ResultsWithIds;
		}
		else if (location === '/results') {
			return Route.Results;
		}

		return Route.Initial;
	}
);
