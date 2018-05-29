import { put, select, takeEvery } from 'redux-saga/effects';
import { GO_TO_LEG, LegAction, setLeg } from '../actions';
import { RootState } from '../../reducers';
import { setCombinations } from '../../fareFamilies/fareFamiliesCombinations/actions';
import { remoteAllFilters } from '../../filters/actions';
import { setSelectedFlight } from '../../selectedFlights/actions';
import { hideFlights } from '../../showAllFlights/actions';
import SelectedFlight from '../../../schemas/SelectedFlight';

function* worker({ payload: newLegId }: LegAction) {
	yield put(setLeg(newLegId));
	yield put(remoteAllFilters());
	yield put(setSelectedFlight(newLegId, null));

	const state: RootState = yield select();
	const selectedFlights = state.selectedFlights;

	for (const legId in selectedFlights) {
		const numberedLegId = parseInt(legId);

		if (selectedFlights.hasOwnProperty(legId)) {
			if (numberedLegId > newLegId) {
				yield put(setSelectedFlight(numberedLegId, null));
				yield put(setCombinations(numberedLegId, null));
			}

			if (numberedLegId < newLegId && selectedFlights[legId].isRT) {
				const RTFlightId = selectedFlights[legId].newFlightId;

				const selectedFlight: SelectedFlight = {
					...selectedFlights[legId],
					newFlightId: RTFlightId.substr(0, RTFlightId.indexOf('/'))
				};

				yield put(setSelectedFlight(numberedLegId, selectedFlight));
			}
		}
	}

	yield put(hideFlights());
}

export default function* goToLegSaga() {
	yield takeEvery(GO_TO_LEG, worker);
}
