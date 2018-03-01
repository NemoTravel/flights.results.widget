import { ApplicationState, SortingDirection, SortingState } from '../../state';
import Flight from '../../schemas/Flight';
import SegmentModel from '../../schemas/Segment';

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

const MINUTES_IN_HOUR = 60;

export const getTotalFlightTime = (flight: Flight): number => {
	return flight.segments.reduce((result: number, segment: SegmentModel) => result + segment.flightTime + segment.waitingTime, 0);
};

export const getCurrentSorting = (state: ApplicationState): SortingState => state.sorting;

export const priceCompareFunction = (a: Flight, b: Flight, direction: SortingDirection): number => {
	return compare(a.totalPrice.amount, b.totalPrice.amount, direction);
};

export const departureTimeCompareFunction = (a: Flight, b: Flight, direction: SortingDirection): number => {
	const aTime = a.segments[0].depDate.hours() * MINUTES_IN_HOUR + a.segments[0].depDate.minutes();
	const bTime = b.segments[0].depDate.hours() * MINUTES_IN_HOUR + b.segments[0].depDate.minutes();

	return compare(aTime, bTime, direction);
};

export const arrivalTimeCompareFunction = (a: Flight, b: Flight, direction: SortingDirection): number => {
	const aTime = a.segments[a.segments.length - 1].arrDate.hours() * MINUTES_IN_HOUR + a.segments[a.segments.length - 1].arrDate.minutes();
	const bTime = b.segments[b.segments.length - 1].arrDate.hours() * MINUTES_IN_HOUR + b.segments[b.segments.length - 1].arrDate.minutes();

	return compare(aTime, bTime, direction);
};

export const flightTimeCompareFunction = (a: Flight, b: Flight, direction: SortingDirection): number => {
	const aTime = getTotalFlightTime(a);
	const bTime = getTotalFlightTime(b);

	return compare(aTime, bTime, direction);
};
