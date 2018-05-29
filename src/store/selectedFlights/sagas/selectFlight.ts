import { put, select, takeEvery } from 'redux-saga/effects';
import { SELECT_FLIGHT, SelectedFlightAction, setSelectedFlight } from '../actions';
import { nextLeg } from '../../currentLeg/actions';
import { isLastLeg } from '../../currentLeg/selectors';
import { remoteAllFilters } from '../../filters/actions';
import { searchFareFamilies } from '../../actions';
import { RootState } from '../../reducers';
import { hideFlights } from '../../showAllFlights/actions';
import Flight from '../../../models/Flight';
import { addFlights } from '../../flights/actions';
import SelectedFlight from '../../../schemas/SelectedFlight';

const splitRTFlight = (flight: Flight): Flight[] => {
	const result: Flight[] = [];

	flight.segmentGroups.forEach((leg, index) => {
		flight.segmentGroups = [leg];
		flight.segments = leg.segments;

		const newFlight = new Flight(flight);
		newFlight.id = `${flight.id}/${index}`;
		result.push(newFlight);
	});

	return result;
};

function* worker({ payload }: SelectedFlightAction) {
	const isComplete: boolean = yield select(isLastLeg);
	const state: RootState = yield select();
	const numOfLegs = state.legs.length;

	if (payload.flight.isRT) {
		// Split RT-flight into pieces by legs.
		const RTPieces = splitRTFlight(state.flights[payload.flight.newFlightId]);

		// Save RT-flight pieces to the global flights pool.
		yield put(addFlights(RTPieces));

		for (let i = 0; i < numOfLegs; i++) {
			if (RTPieces[i]) {
				const newSelectedFlight: SelectedFlight = {
					...payload.flight,
					newFlightId: RTPieces[i].id
				};

				yield put(setSelectedFlight(i, newSelectedFlight));
				yield put(searchFareFamilies(newSelectedFlight.newFlightId, i));
			}
		}
	}
	else {
		yield put(setSelectedFlight(payload.legId, payload.flight));
		yield put(searchFareFamilies(payload.flight.newFlightId, payload.legId));
	}

	if (!isComplete) {
		yield put(nextLeg());
	}

	yield put(hideFlights());
	yield put(remoteAllFilters());
}

export default function* selectFlightSaga() {
	yield takeEvery(SELECT_FLIGHT, worker);
}
