import { all, put, select, takeEvery } from 'redux-saga/effects';
import { GO_BACK, GO_TO_LEG, goToLeg, LegAction, setLeg } from './actions';
import { setCombinations } from '../fareFamilies/fareFamiliesCombinations/actions';
import { remoteAllFilters } from '../filters/actions';
import { setSelectedFlight } from '../selectedFlights/actions';
import { ApplicationState } from '../../state';
import { isSelectionComplete } from '../selectedFlights/selectors';

function* goToLegWorker({ payload: newLegId }: LegAction) {
	yield put(setLeg(newLegId));
	yield put(remoteAllFilters());
	yield put(setSelectedFlight(null, newLegId));

	const state: ApplicationState = yield select();
	const selectedFlights = state.selectedFlights;

	for (const legId in selectedFlights) {
		const numberedLegId = parseInt(legId);

		if (selectedFlights.hasOwnProperty(legId) && numberedLegId > newLegId) {
			yield put(setSelectedFlight(null, numberedLegId));
			yield put(setCombinations(numberedLegId, null));
		}
	}
}

function* goToLegWatcher() {
	yield takeEvery(GO_TO_LEG, goToLegWorker);
}

// -----------------------------------------------------------------------------------------

function* goBackWorker() {
	const state: ApplicationState = yield select();
	const isComplete: boolean = yield select(isSelectionComplete);
	const currentLeg = state.currentLeg;
	let newLegId = currentLeg - 1;

	if (isComplete) {
		newLegId = currentLeg;
	}

	yield put(goToLeg(newLegId));
}

function* goBackWatcher() {
	yield takeEvery(GO_BACK, goBackWorker);
}

export default function* currentLegSagas() {
	yield all([
		goToLegWatcher(),
		goBackWatcher()
	]);
}
