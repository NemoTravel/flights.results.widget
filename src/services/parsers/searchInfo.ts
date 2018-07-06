import * as APIParser from '@nemo.travel/api-parser';
import * as moment from 'moment';
import { SearchInfo, SearchInfoSegment } from '@nemo.travel/search-widget';

export const parse = (response: APIParser.Response, searchResultsId: string): SearchInfo => {
	let result: SearchInfo;
	const objects = APIParser(response);
	const responseInfo = objects[`flight/search/info/${searchResultsId}`];

	if (responseInfo) {
		result = {
			routeType: responseInfo['routeType'],
			serviceClass: responseInfo['serviceClass'],
			passengers: responseInfo['passengers'],
			segments: responseInfo['segments'].map((segment: any): SearchInfoSegment => {
				segment.departureDate = moment(segment.departureDate);

				return segment as SearchInfoSegment;
			})
		};
	}

	return result;
};
