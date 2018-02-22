import * as APIParser from '@nemo.travel/api-parser';
import Flight from '../../schemas/Flight';
import { parse as parseFlight } from './flight';

export const parse = (response: APIParser.Response, parentFlightId: number): Flight[] => {
	let flights: Flight[] = [];
	const objects = APIParser(response);
	const responseInfo = objects[`flight/fareFamilies/${parentFlightId}`];

	if (responseInfo && responseInfo.hasOwnProperty('target')) {
		const results = responseInfo.target;

		flights = results.map(parseFlight);
	}

	return flights;
};
