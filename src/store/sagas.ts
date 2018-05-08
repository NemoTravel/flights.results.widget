import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
import { SearchAction, SearchActionPayload, START_SEARCH, SEARCH_FARE_FAMILIES } from './actions';
import { setLegs } from './legs/actions';
import * as moment from 'moment';
import loadSearchResults from '../services/requests/results';
import { startLoading, stopLoading } from './isLoading/actions';
import Leg from '../schemas/Leg';
import { addFlightsRT } from './flightsRT/actions';
import RequestInfo from '../schemas/RequestInfo';
import { addFlights } from './flights/actions';
import { setFlightsByLeg } from './flightsByLegs/actions';
import Flight from '../models/Flight';
import { ApplicationState } from '../state';
import loadFareFamilies from '../services/requests/fareFamilies';
import FareFamiliesCombinations from '../schemas/FareFamiliesCombinations';
import { setCombinations } from './fareFamilies/fareFamiliesCombinations/actions';
import { setSelectedFamily } from './fareFamilies/selectedFamilies/actions';

const createLegs = (requests: RequestInfo[]): Leg[] => {
	return requests.map((requestInfo, index) => {
		return {
			id: index,
			departure: requestInfo.segments[0].departure.IATA,
			arrival: requestInfo.segments[0].arrival.IATA,
			date: moment(requestInfo.segments[0].departureDate)
		};
	});
};

function* runSearch(request: RequestInfo, index: number) {
	const flights: Flight[] = yield call(loadSearchResults, request);

	yield put(addFlights(flights));
	yield put(setFlightsByLeg(flights, index));
}

function* runRTSearch(request: RequestInfo) {
	const RTresults: Flight[] = yield call(loadSearchResults, request);

	yield put(addFlightsRT(RTresults));
}

function* runSearches(data: SearchActionPayload) {
	// Run async round-trip search.
	yield fork(runRTSearch, data.RTRequest);

	// Split round-trip search into separate one-way searches.
	const numOfLegs = data.requests.length;

	for (let i = 0; i < numOfLegs; i++) {
		yield fork(runSearch, data.requests[i], i);
	}
}

function* startSearchWorker({ payload }: SearchAction) {
	// Launch loading animation.
	yield put(startLoading());

	// Create legs array.
	yield put(setLegs(createLegs(payload.requests)));

	// Run all searches.
	yield call(runSearches, payload);

	// Stop loading animation.
	yield put(stopLoading());
}

function* startSearchWatcher() {
	yield takeEvery(START_SEARCH, startSearchWorker);
}

// -----------------------------------------------------------------------------------------

function* runFareFamiliesSearch(flightId: number, legId: number) {
	// Get fare families combinations for given flight.
	const results: FareFamiliesCombinations = yield call(loadFareFamilies, flightId);

	// Put them in Store.
	yield put(setCombinations(legId, results));

	// Split initial combination key apart.
	const combinationParts = results ? results.initialCombination.split('_') : [];
	const numOfSegments = combinationParts.length;

	// Pre-select fare families.
	for (let segmentId = 0; segmentId < numOfSegments; segmentId++) {
		const familyId = combinationParts[segmentId];

		yield put(setSelectedFamily(legId, segmentId, familyId));
	}
}

function* searchFareFamilies(flightIds: number[]) {
	const numOfLegs = flightIds.length;

	// Run fare families search for each given flight ID.
	for (let i = 0; i < numOfLegs; i++) {
		yield fork(runFareFamiliesSearch, flightIds[i], i);
	}
}

function* searchFareFamiliesWorker() {
	// Launch loading animation.
	yield put(startLoading());

	const state: ApplicationState = yield select();
	const selectedFlights = state.selectedFlights;
	const flightIds: number[] = [];

	// Collect IDs of selected flights.
	for (const legId in selectedFlights) {
		if (selectedFlights.hasOwnProperty(legId)) {
			flightIds.push(selectedFlights[legId]);
		}
	}

	// Run all searches.
	yield call(searchFareFamilies, flightIds);

	// Stop loading animation.
	yield put(stopLoading());
}

function* searchFareFamiliesWatcher() {
	yield takeEvery(SEARCH_FARE_FAMILIES, searchFareFamiliesWorker);
}

export default function*() {
	yield all([
		startSearchWatcher(),
		searchFareFamiliesWatcher()
	]);
}
