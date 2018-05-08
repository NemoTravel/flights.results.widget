import { put, select, takeEvery } from 'redux-saga/effects';
import { GO_TO_LEG, LegAction, setLeg } from '../actions';
import { ApplicationState } from '../../../state';
import { setCombinations } from '../../fareFamilies/fareFamiliesCombinations/actions';
import { remoteAllFilters } from '../../filters/actions';
import { setSelectedFlight } from '../../selectedFlights/actions';

function* worker({ payload: newLegId }: LegAction) {
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

export default function* goToLegSaga() {
	yield takeEvery(GO_TO_LEG, worker);
}