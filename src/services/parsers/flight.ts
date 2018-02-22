import * as moment from 'moment';
import Flight from '../../schemas/Flight';
import Date from '../../schemas/Date';

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

export const parse = (flightFromResponse: any): Flight => {
	flightFromResponse.segments = flightFromResponse.segments.map((segment: any) => {
		segment.arrDate = convertNemoDateToMoment(segment.arrDate);
		segment.depDate = convertNemoDateToMoment(segment.depDate);

		return segment;
	});

	return <Flight>flightFromResponse;
};
