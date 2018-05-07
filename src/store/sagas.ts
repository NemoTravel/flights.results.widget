import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { SearchAction, SearchActionPayload, START_SEARCH } from './actions';
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

function* worker({ payload }: SearchAction) {
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
	yield takeEvery(START_SEARCH, worker);
}

export default function*() {
	yield all([
		startSearchWatcher()
	]);
}
