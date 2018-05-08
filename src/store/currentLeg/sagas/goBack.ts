import { put, select, takeEvery } from 'redux-saga/effects';
import { ApplicationState } from '../../../state';
import { isSelectionComplete } from '../../selectedFlights/selectors';
import { GO_BACK, goToLeg } from '../actions';

function* worker() {
	const state: ApplicationState = yield select();
	const isComplete: boolean = yield select(isSelectionComplete);
	const currentLeg = state.currentLeg;
	let newLegId = currentLeg - 1;

	if (isComplete) {
		newLegId = currentLeg;
	}

	yield put(goToLeg(newLegId));
}

export default function* goBackSaga() {
	yield takeEvery(GO_BACK, worker);
}
