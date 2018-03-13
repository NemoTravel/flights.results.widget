import * as moment from 'moment';
import Flight from '../../schemas/Flight';
import Date from '../../schemas/Date';
import Segment from '../../schemas/Segment';

const lastSingleNumber = 9;

/**
 * Convert '9' number to '09'.
 *
 * @param {number} brokenNumber
 * @returns {string}
 */
const fixNumber = (brokenNumber: number): string => brokenNumber > lastSingleNumber ? brokenNumber.toString() : '0' + brokenNumber.toString();

/**
 * Convert Nemo date object to Moment.
 *
 * @param {Date} date
 * @returns {moment.Moment}
 */
const convertNemoDateToMoment = (date: Date): moment.Moment => {
	let dateString = `${date.year}-${fixNumber(date.month)}-${fixNumber(date.day)}T${fixNumber(date.hours)}:${fixNumber(date.minutes)}:${fixNumber(date.seconds)}`;

	if (date.offsetUTC) {
		dateString += date.offsetUTC;
	}

	return moment(dateString);
};

/**
 * Create a part of flight Unique ID (UID) for each segment.
 *
 * XX-123_1pc (flight number on the segment + free baggage allowance on the segment).
 *
 * @param {Segment} segment
 * @returns {string}
 */
export const createFlightUIDPart = (segment: Segment): string => {
	return `${segment.airline.IATA}-${segment.flightNumber}_${segment.luggage.value === null ? 0 : segment.luggage.value}${segment.luggage.measurement}`;
};

export const parse = (flightFromResponse: any): Flight => {
	const uid: string[] = [];

	flightFromResponse.segments = flightFromResponse.segments.map((segment: any) => {
		segment.arrDate = convertNemoDateToMoment(segment.arrDate);
		segment.depDate = convertNemoDateToMoment(segment.depDate);

		uid.push(createFlightUIDPart(segment as Segment));

		return segment;
	});

	flightFromResponse.uid = uid.join('_');

	return flightFromResponse as Flight;
};
