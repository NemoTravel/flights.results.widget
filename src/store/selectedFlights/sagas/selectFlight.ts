import { put, select, takeEvery } from 'redux-saga/effects';
import { SELECT_FLIGHT, SelectedFlightAction, setSelectedFlight } from '../actions';
import { nextLeg } from '../../currentLeg/actions';
import { isLastLeg } from '../../currentLeg/selectors';
import { remoteAllFilters } from '../../filters/actions';
import { searchFareFamilies, searchFareFamiliesRT } from '../../actions';
import { RootState } from '../../reducers';
import { hideFlights } from '../../showAllFlights/actions';
import Flight from '../../../models/Flight';
import { addFlights } from '../../flights/actions';
import SelectedFlight from '../../../schemas/SelectedFlight';

const splitRTFlight = (flight: Flight): Flight[] => {
	const result: Flight[] = [];

	flight.segmentGroups.forEach((leg, index) => {
		const newFlight = {
			...flight,
			segmentGroups: [leg],
			segments: leg.segments
		};

		newFlight.id = `${flight.id}/${index}`;
		result.push(newFlight as Flight);
	});

	return result;
};

function* worker({ payload }: SelectedFlightAction) {
	const { legId, flight } = payload;
	const isComplete: boolean = yield select(isLastLeg);
	const state: RootState = yield select();
	const selectedFlights = state.selectedFlights;
	const numOfLegs = state.legs.length;

	if (flight.isRT) {
		// Split RT-flight into different flights objects by legs.
		// Each created flight will have it's own custom flight ID like `RT_flight_id/leg_id`.
		// Example: 1560410001/0, 1560410001/1
		const RTPieces = splitRTFlight(state.flights[flight.newFlightId]);

		// Save new flights to the global flights pool.
		yield put(addFlights(RTPieces));

		// OK, now let's set our new created flights objects as selected ones.
		for (let i = 0; i < numOfLegs; i++) {
			if (RTPieces[i]) {
				// Already have selected flight for this leg? Use it as a template.
				const selectedFlightTemplate = selectedFlights[i] ? selectedFlights[i] : flight;

				// New object for `selectedFlights` state.
				const newSelectedFlight: SelectedFlight = {
					...selectedFlightTemplate,
					isRT: true,
					newFlightId: RTPieces[i].id
				};

				yield put(setSelectedFlight(i, newSelectedFlight));
			}
		}

		yield put(searchFareFamiliesRT(flight.newFlightId));
	}
	else {
		yield put(setSelectedFlight(legId, flight));
		yield put(searchFareFamilies(legId, flight.newFlightId));
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
