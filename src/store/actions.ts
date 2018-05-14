import { SearchInfo, SearchInfoSegment } from '@nemo.travel/search-widget';
import { Action } from 'redux';

import RequestInfo from '../schemas/RequestInfo';
import { NUM_OF_RT_SEGMENTS } from '../utils';
import { RouteType } from '../enums';

export const START_SEARCH = 'START_SEARCH';
export const SEARCH_FARE_FAMILIES = 'SEARCH_FARE_FAMILIES';

export interface SearchActionPayload {
	requests: RequestInfo[];
	RTRequest: RequestInfo;
}

export interface SearchAction extends Action {
	payload: SearchActionPayload;
}

const createSearchPayload = (searchInfo: SearchInfo): SearchActionPayload => {
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

export const startSearch = (searchInfo: SearchInfo): SearchAction => {
	return {
		type: START_SEARCH,
		payload: createSearchPayload(searchInfo)
	};
};

export const searchFareFamilies = (): Action => {
	return {
		type: SEARCH_FARE_FAMILIES
	};
};
