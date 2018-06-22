import Flight from '../../models/Flight';
import { call, fork, put, select, takeEvery } from 'redux-saga/effects';
import RequestInfo from '../../schemas/RequestInfo';
import { startLoading, stopLoading } from '../isLoading/actions';
import { addFlightsRT } from '../flightsRT/actions';
import loadSearchResults from '../../services/requests/results';
import { setLegs } from '../legs/actions';
import { SearchAction, SearchActionPayload, START_SEARCH } from '../actions';
import { addFlights } from '../flights/actions';
import { setFlightsByLeg } from '../flightsByLegs/actions';
import { goToLeg } from '../currentLeg/actions';
import { createLegs } from '../../utils';
import { getCurrentLegId } from '../currentLeg/selectors';
import { getIsLoading } from '../isLoading/selectors';

function* runSearch(request: RequestInfo, index: number) {
	const flights: Flight[] = yield call(loadSearchResults, request);

	flights.forEach(flight => flight.legId = index);

	yield put(addFlights(flights));
	yield put(setFlightsByLeg(flights, index));
}

function* runRTSearch(request: RequestInfo) {
	const flights: Flight[] = yield call(loadSearchResults, request);

	yield put(addFlights(flights));
	yield put(addFlightsRT(flights));
}

function* runSearches(data: SearchActionPayload) {
	if (data.RTRequest) {
		// Run async round-trip search.
		yield fork(runRTSearch, data.RTRequest);
	}

	// Split round-trip search into separate one-way searches.
	const numOfLegs = data.requests.length;

	for (let i = 0; i < numOfLegs; i++) {
		yield fork(runSearch, data.requests[i], i);
	}
}

function* worker({ payload }: SearchAction) {
	const isLoading: boolean = yield select(getIsLoading);

	if (!isLoading) {

		// Launch loading animation.
		yield put(startLoading());

		// Create legs array.
		yield put(setLegs(createLegs(payload.requests)));

		// If current leg is not `0`, reset selected flights and legs.
		const currentLeg: number = yield select(getCurrentLegId);

		if (currentLeg) {
			yield put(goToLeg(0));
		}

		// Run all searches.
		yield call(runSearches, payload);

		// Stop loading animation.
		yield put(stopLoading());
	}
}

export default function* startSearchSaga() {
	yield takeEvery(START_SEARCH, worker);
}
