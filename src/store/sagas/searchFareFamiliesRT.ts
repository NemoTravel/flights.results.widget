import { call, cancel, cancelled, fork, put, select, take, takeEvery } from 'redux-saga/effects';
import {
	SEARCH_FARE_FAMILIES_RT,
	SearchFareFamiliesRTAction
} from '../actions';
import FareFamiliesCombinations, { FareFamiliesBySegments } from '../../schemas/FareFamiliesCombinations';
import { clearSelectedFamilies, selectFamily } from '../fareFamilies/selectedFamilies/actions';
import loadFareFamilies from '../../services/requests/fareFamilies';
import { clearCombinations, setCombinations } from '../fareFamilies/fareFamiliesCombinations/actions';
import { startLoadingFareFamilies, stopLoadingFareFamilies } from '../isLoadingFareFamilies/actions';
import { RootState } from '../reducers';
import { setRTMode } from '../fareFamilies/isRTMode/actions';

function* worker({ payload }: SearchFareFamiliesRTAction) {
	const { flightId } = payload;

	try {
		// Show some loader (doesn't matter which one).
		yield put(startLoadingFareFamilies(0));
		yield put(setRTMode(true));

		// Get fare families combinations for given RT flight.
		const results: FareFamiliesCombinations = yield call(loadFareFamilies, flightId);
		const state: RootState = yield select();
		const flight = state.flights[flightId];
		const numOfLegs = flight.segmentGroups.length;

		// Clear all previous loaded data.
		yield put(clearCombinations());
		yield put(clearSelectedFamilies());

		const initialCombinationParts = results.initialCombination.split('_');
		const fareFamiliesBySegments = results.fareFamiliesBySegments;

		// Let the shit river flow:
		// Previously, we've loaded fare families info for selected RT flight.
		// But all logic of fare families selection is based on the idea of OW+OW flights (eg: each leg should have it's own flight).
		//
		// For the RT flight case, we have only ONE instance of flight object for ALL legs.
		// So we have to split fare families results by legs manually, to avoid UI problems.
		for (let i = 0; i < numOfLegs; i++) {
			// Leg of RT flight.
			const leg = flight.segmentGroups[i];
			// Number of segments on leg.
			const numOfSegments = leg.segments.length;
			// New list of families on each segment.
			const families: FareFamiliesBySegments = {};
			// Initial selected families on each segments.
			const combinationParts = initialCombinationParts.splice(0, numOfSegments);
			// Initial combinations key.
			const initialCombination = combinationParts.join('_');

			for (const segmentKey in fareFamiliesBySegments) {
				if (fareFamiliesBySegments.hasOwnProperty(segmentKey)) {
					// Get `int` number of segment from API.
					const intSegmentKey = parseInt(segmentKey.replace('S', ''));
					// Segment index for new object.
					let newSegmentIndex: number;
					// Check if leg has given segment.
					const segment = leg.segments.find((segment, index) => {
						const result = segment.number === intSegmentKey;

						if (result) {
							newSegmentIndex = index;
						}

						return result;
					});

					// We've found some! Save it to store.
					if (segment && typeof newSegmentIndex !== 'undefined') {
						families[`S${newSegmentIndex}`] = fareFamiliesBySegments[segmentKey];
					}
				}
			}

			yield put(setCombinations(i, {
				...results,
				fareFamiliesBySegments: families,
				initialCombination: initialCombination
			}));

			// Pre-select fare families.
			for (let segmentId = 0; segmentId < numOfSegments; segmentId++) {
				const familyId = combinationParts[segmentId];

				yield put(selectFamily(i, segmentId, familyId));
			}
		}

		yield put(stopLoadingFareFamilies(0));
	}
	catch (error) {
		yield put(stopLoadingFareFamilies(0));
	}
}

/**
 * Loading fare families for RT flights.
 */
export default function* searchFareFamiliesRTSaga() {
	yield takeEvery(SEARCH_FARE_FAMILIES_RT, worker);
}
