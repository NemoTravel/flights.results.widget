import { SEARCH_FARE_FAMILIES } from '../actions';
import { call, fork, put, select, takeEvery } from 'redux-saga/effects';
import { startLoading, stopLoading } from '../isLoading/actions';
import FareFamiliesCombinations from '../../schemas/FareFamiliesCombinations';
import { selectFamily } from '../fareFamilies/selectedFamilies/actions';
import loadFareFamilies from '../../services/requests/fareFamilies';
import { setCombinations } from '../fareFamilies/fareFamiliesCombinations/actions';
import { ApplicationState } from '../../state';

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

		yield put(selectFamily(legId, segmentId, familyId));
	}
}

function* searchFareFamilies(flightIds: number[]) {
	const numOfLegs = flightIds.length;

	// Run fare families search for each given flight ID.
	for (let i = 0; i < numOfLegs; i++) {
		yield fork(runFareFamiliesSearch, flightIds[i], i);
	}
}

function* worker() {
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

export default function* searchFareFamiliesSaga() {
	yield takeEvery(SEARCH_FARE_FAMILIES, worker);
}
