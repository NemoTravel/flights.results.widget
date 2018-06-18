import { Task } from 'redux-saga';
import { call, cancel, cancelled, fork, put, take } from 'redux-saga/effects';

import { SEARCH_FARE_FAMILIES, SearchFareFamiliesAction } from '../actions';
import FareFamiliesCombinations from '../../schemas/FareFamiliesCombinations';
import { selectFamily } from '../fareFamilies/selectedFamilies/actions';
import loadFareFamilies from '../../services/requests/fareFamilies';
import { setCombinations } from '../fareFamilies/fareFamiliesCombinations/actions';
import { startLoadingFareFamilies, stopLoadingFareFamilies } from '../isLoadingFareFamilies/actions';
import { setRTMode } from '../fareFamilies/isRTMode/actions';

const pool: { [flightId: string]: Task } = {};

function* runFareFamiliesSearch(legId: number, flightId: string) {
	try {
		yield put(startLoadingFareFamilies(legId));
		yield put(setRTMode(false));

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

		yield put(stopLoadingFareFamilies(legId));
	}
	catch (error) {
		yield put(stopLoadingFareFamilies(legId));
	}
}

/**
 * Load fare families for OW or Multi-OW flights.
 *
 * Families for RT flights are loaded by `searchFareFamiliesRTSaga`!
 */
export default function* searchFareFamiliesSaga() {
	while (true) {
		const { payload }: SearchFareFamiliesAction = yield take(SEARCH_FARE_FAMILIES);

		if (pool[payload.flightId]) {
			// NOTE: AJAX request will not be aborted, because we use brand new fetch API,
			// which does not provide any cancellation tools just yet.
			yield cancel(pool[payload.flightId]);
		}

		// Run search and save search-task in the pool object, so we can cancel it later on.
		pool[payload.flightId] = yield fork(runFareFamiliesSearch, payload.legId, payload.flightId);
	}
}
