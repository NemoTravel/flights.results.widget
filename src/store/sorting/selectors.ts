import { ApplicationState, SortingState } from '../../state';
import Flight from '../../models/Flight';
import SegmentModel from '../../schemas/Segment';
import { PricesByFlights } from '../selectors';
import { SortingDirection } from '../../enums';
import { FlightsReplacement } from '../../schemas/SelectedFlight';

/**
 * Compare two objects considering the sorting direction.
 *
 * @param a
 * @param b
 * @param {SortingDirection} direction
 * @returns {number}
 */
const compare = (a: any, b: any, direction: SortingDirection): number => {
	if (a > b) {
		return direction === SortingDirection.ASC ? 1 : -1;
	}
	else if (a < b) {
		return direction === SortingDirection.ASC ? -1 : 1;
	}
	else {
		return 0;
	}
};

/**
 * @param {Flight} flight
 * @returns {number}
 */
export const getTotalFlightTime = (flight: Flight): number => {
	return flight.segments.reduce((result: number, segment: SegmentModel) => result + segment.flightTime + segment.waitingTime, 0);
};

/**
 * Current active sorting.
 *
 * @param {ApplicationState} state
 * @returns {SortingState}
 */
export const getCurrentSorting = (state: ApplicationState): SortingState => state.sorting;

/**
 * Compare two flights by total price.
 *
 * @param {Flight} a
 * @param {Flight} b
 * @param {SortingDirection} direction
 * @param {PricesByFlights} prices
 * @returns {number}
 */
export const priceCompareFunction = (a: Flight, b: Flight, direction: SortingDirection, prices: FlightsReplacement): number => {
	const aPrice = prices.hasOwnProperty(a.id) ? Math.abs(prices[a.id].price.amount) : a.totalPrice.amount;
	const bPrice = prices.hasOwnProperty(b.id) ? Math.abs(prices[b.id].price.amount) : b.totalPrice.amount;

	return compare(aPrice, bPrice, direction);
};

/**
 * Compare two flights by departure time.
 *
 * @param {Flight} a
 * @param {Flight} b
 * @param {SortingDirection} direction
 * @returns {number}
 */
export const departureTimeCompareFunction = (a: Flight, b: Flight, direction: SortingDirection): number => {
	const aTime = a.segments[0].depDate.unix();
	const bTime = b.segments[0].depDate.unix();

	return compare(aTime, bTime, direction);
};

/**
 * Compare two flights by arrival time.
 *
 * @param {Flight} a
 * @param {Flight} b
 * @param {SortingDirection} direction
 * @returns {number}
 */
export const arrivalTimeCompareFunction = (a: Flight, b: Flight, direction: SortingDirection): number => {
	const aTime = a.segments[a.segments.length - 1].arrDate.unix();
	const bTime = b.segments[b.segments.length - 1].arrDate.unix();

	return compare(aTime, bTime, direction);
};

/**
 * Compare two flights by total flight time.
 *
 * @param {Flight} a
 * @param {Flight} b
 * @param {SortingDirection} direction
 * @returns {number}
 */
export const flightTimeCompareFunction = (a: Flight, b: Flight, direction: SortingDirection): number => {
	const aTime = getTotalFlightTime(a);
	const bTime = getTotalFlightTime(b);

	return compare(aTime, bTime, direction);
};
