import { SEARCH_FARE_FAMILIES, SearchFareFamiliesAction } from '../actions';
import { call, put, takeEvery } from 'redux-saga/effects';
import FareFamiliesCombinations from '../../schemas/FareFamiliesCombinations';
import { selectFamily } from '../fareFamilies/selectedFamilies/actions';
import loadFareFamilies from '../../services/requests/fareFamilies';
import { setCombinations } from '../fareFamilies/fareFamiliesCombinations/actions';
import { startLoadingFareFamilies, stopLoadingFareFamilies } from '../isLoadingFareFamilies/actions';

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

function* worker({ payload }: SearchFareFamiliesAction) {
	// Launch loading animation.
	yield put(startLoadingFareFamilies());

	// Run search.
	yield call(runFareFamiliesSearch, payload.flightId, payload.legId);

	// Stop loading animation.
	yield put(stopLoadingFareFamilies());
}

export default function* searchFareFamiliesSaga() {
	yield takeEvery(SEARCH_FARE_FAMILIES, worker);
}
