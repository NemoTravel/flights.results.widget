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
			// Clear out all selected flights for the next legs.
			if (numberedLegId > newLegId) {
				yield put(setSelectedFlight(numberedLegId, null));
				yield put(setCombinations(numberedLegId, null));
			}

			// Restore all selected flights from RT to original state for the previous legs.
			if (numberedLegId < newLegId && selectedFlights[legId].isRT) {
				// Get back old (non-RT) flight ID.
				const selectedFlight: SelectedFlight = {
					...selectedFlights[legId],
					originalFlightId: selectedFlights[legId].originalFlightId,
					newFlightId: selectedFlights[legId].originalFlightId
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
