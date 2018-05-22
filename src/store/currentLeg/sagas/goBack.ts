import { put, select, takeEvery } from 'redux-saga/effects';
import { RootState } from '../../reducers';
import { isSelectionComplete } from '../../selectedFlights/selectors';
import { GO_BACK, goToLeg } from '../actions';
import { hideFlights } from '../../showAllFlights/actions';

function* worker() {
	const state: RootState = yield select();
	const isComplete: boolean = yield select(isSelectionComplete);
	const currentLeg = state.currentLeg;
	let newLegId = currentLeg - 1;

	if (isComplete) {
		newLegId = currentLeg;
	}

	yield put(hideFlights());
	yield put(goToLeg(newLegId));
}

export default function* goBackSaga() {
	yield takeEvery(GO_BACK, worker);
}
