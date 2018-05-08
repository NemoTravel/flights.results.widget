import { all } from 'redux-saga/effects';
import removeAllFiltersSaga from './sagas/removeAllFilters';

export default function* filtersSagas() {
	yield all([
		removeAllFiltersSaga()
	]);
}
