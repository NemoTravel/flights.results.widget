import { put, select, takeEvery } from 'redux-saga/effects';
import { SELECT_FLIGHT, SelectedFlightAction, setSelectedFlight } from '../actions';
import { nextLeg } from '../../currentLeg/actions';
import { isLastLeg } from '../../currentLeg/selectors';
import { remoteAllFilters } from '../../filters/actions';

function* worker({ payload }: SelectedFlightAction) {
	const isComplete: boolean = yield select(isLastLeg);

	if (!isComplete) {
		yield put(nextLeg());
	}

	yield put(setSelectedFlight(payload.flightId, payload.legId));
	yield put(remoteAllFilters());
}

export default function* selectFlightSaga() {
	yield takeEvery(SELECT_FLIGHT, worker);
}
