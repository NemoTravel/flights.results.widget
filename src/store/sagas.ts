import { all } from 'redux-saga/effects';
import currentLegSagas from './currentLeg/sagas';
import filtersSagas from './filters/sagas';
import startSearchSaga from './sagas/startSearch';
import searchFareFamiliesSaga from './sagas/searchFareFamilies';

export default function*() {
	yield all([
		startSearchSaga(),
		searchFareFamiliesSaga(),
		currentLegSagas(),
		filtersSagas()
	]);
}
