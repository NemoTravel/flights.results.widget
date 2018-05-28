import { SearchInfo, SearchInfoSegment } from '@nemo.travel/search-widget';

import RequestInfo from '../schemas/RequestInfo';
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

	switch (searchInfo.routeType) {
		case RouteType.RT:
			// RT search
			const departureSegment: SearchInfoSegment = segments[0];
			const returnSegment: SearchInfoSegment = segments[1];

			requests.push({ ...commonParams, segments: [ departureSegment ] });
			requests.push({ ...commonParams, segments: [ returnSegment ] });

			RTRequest = { ...commonParams, segments: [ departureSegment, returnSegment ] };

			break;

		case RouteType.OW:
			requests.push({
				...commonParams,
				segments: [ segments[0] ]
			});

			break;

		default:
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

export const searchFareFamilies = (flightId: string, legId: number) => {
	return {
		type: SEARCH_FARE_FAMILIES,
		payload: {
			flightId,
			legId
		}
	};
};
