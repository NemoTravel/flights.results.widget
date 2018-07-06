import * as APIParser from '@nemo.travel/api-parser';
import Flight from '../../models/Flight';
import { parse as parseFlight } from './flight';

const parseTarget = (target: APIParser.Response[]): Flight[] => {
	return target.map(parseFlight);
};

export const parseLoadResults = (response: APIParser.Response, searchResultsId: string): Flight[] => {
	let flights: Flight[] = [];
	const objects = APIParser(response);
	const responseInfo = objects[`flight/search/${searchResultsId}`];

	if (responseInfo && responseInfo.hasOwnProperty('target')) {
		flights = parseTarget(responseInfo.target);
	}

	return flights;
};

export const parse = (response: APIParser.Response): Flight[] => {
	let flights: Flight[] = [];
	const objects = APIParser(response);
	const responseInfo = objects['flight/search/run'];

	if (responseInfo && responseInfo.hasOwnProperty('target')) {
		flights = parseTarget(responseInfo.target);
	}

	return flights;
};
