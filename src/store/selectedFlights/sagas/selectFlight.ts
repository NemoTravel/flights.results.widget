import { put, select, takeEvery } from 'redux-saga/effects';
import { SELECT_FLIGHT, SelectedFlightAction, setSelectedFlight } from '../actions';
import { nextLeg } from '../../currentLeg/actions';
import { isLastLeg } from '../../currentLeg/selectors';
import { remoteAllFilters } from '../../filters/actions';
import { searchFareFamilies } from '../../actions';
import { RootState } from '../../reducers';

function* worker({ payload }: SelectedFlightAction) {
	const isComplete: boolean = yield select(isLastLeg);
	const state: RootState = yield select();
	const numOfLegs = state.legs.length;

	if (payload.flight.isRT) {
		// When selecting RT flight, we must replace all previous selected flights with the new one.
		for (let i = 0; i < numOfLegs; i++) {
			yield put(setSelectedFlight(payload.flight, i));
			yield put(searchFareFamilies(payload.flight.newFlightId, i));
		}
	}
	else {
		yield put(setSelectedFlight(payload.flight, payload.legId));
		yield put(searchFareFamilies(payload.flight.newFlightId, payload.legId));
	}

	if (!isComplete) {
		yield put(nextLeg());
	}

	yield put(remoteAllFilters());
}

export default function* selectFlightSaga() {
	yield takeEvery(SELECT_FLIGHT, worker);
}
