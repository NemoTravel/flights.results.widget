import { put, select, takeEvery } from 'redux-saga/effects';
import { SELECT_FLIGHT, SelectedFlightAction, setSelectedFlight } from '../actions';
import { nextLeg } from '../../currentLeg/actions';
import { isLastLeg } from '../../currentLeg/selectors';
import { remoteAllFilters } from '../../filters/actions';

function* worker({ payload }: SelectedFlightAction) {
	const isComplete: boolean = yield select(isLastLeg);

	yield put(setSelectedFlight(payload.flight, payload.legId));

	if (!isComplete) {
		yield put(nextLeg());
	}

	yield put(remoteAllFilters());
}

export default function* selectFlightSaga() {
	yield takeEvery(SELECT_FLIGHT, worker);
}
