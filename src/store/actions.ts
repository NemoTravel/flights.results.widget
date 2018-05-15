import { SearchInfo, SearchInfoSegment } from '@nemo.travel/search-widget';

import RequestInfo from '../schemas/RequestInfo';
import { NUM_OF_RT_SEGMENTS } from '../utils';
import { RouteType } from '../enums';

export const START_SEARCH = 'START_SEARCH';
export const SEARCH_FARE_FAMILIES = 'SEARCH_FARE_FAMILIES';

export type SearchAction = ReturnType<typeof startSearch>;
export type SearchActionPayload = ReturnType<typeof createSearchPayload>;
export type SearchFareFamiliesAction = ReturnType<typeof searchFareFamilies>;

const createSearchPayload = (searchInfo: SearchInfo) => {
	let RTRequest: RequestInfo = null;
	let requests: RequestInfo[] = [];

	const segments = searchInfo.segments;
	const commonParams = {
		passengers: searchInfo.passengers,
		parameters: {
			delayed: false,
			serviceClass: searchInfo.serviceClass
		}
	};

	if (searchInfo.routeType === RouteType.RT && segments.length === NUM_OF_RT_SEGMENTS) {
		// RT search
		const departureSegment: SearchInfoSegment = segments[0];
		const returnSegment: SearchInfoSegment = segments[1];

		requests.push({ ...commonParams, segments: [ departureSegment ] });
		requests.push({ ...commonParams, segments: [ returnSegment ] });

		RTRequest = { ...commonParams, segments: [ departureSegment, returnSegment ] };
	}
	else {
		// OW and CR search
		requests = segments.map((segment: SearchInfoSegment): RequestInfo => ({
			...commonParams,
			segments: [ segment ]
		}));
	}

	return {
		requests,
		RTRequest
	};
};

export const startSearch = (searchInfo: SearchInfo) => {
	return {
		type: START_SEARCH,
		payload: createSearchPayload(searchInfo)
	};
};

export const searchFareFamilies = (flightId: number, legId: number) => {
	return {
		type: SEARCH_FARE_FAMILIES,
		payload: {
			flightId,
			legId
		}
	};
};
