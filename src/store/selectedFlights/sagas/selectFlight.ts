import { put, select, takeEvery } from 'redux-saga/effects';
import { SELECT_FLIGHT, SelectedFlightAction, setSelectedFlight } from '../actions';
import { nextLeg } from '../../currentLeg/actions';
import { isLastLeg } from '../../currentLeg/selectors';
import { removeAllFilters } from '../../filters/actions';
import { searchFareFamilies, searchFareFamiliesRT } from '../../actions';
import { RootState } from '../../reducers';
import { hideFlights } from '../../showAllFlights/actions';
import Flight from '../../../models/Flight';
import { addFlights } from '../../flights/actions';
import SelectedFlight from '../../../schemas/SelectedFlight';
import { Action } from 'redux';
import { batchActions } from '../../batching/actions';

const splitRTFlight = (flight: Flight): Flight[] => {
	const result: Flight[] = [];

	flight.segmentGroups.forEach((leg, index) => {
		const newFlight = new Flight({
			...flight as any,
			segmentGroups: [leg],
			segments: leg.segments
		});

		newFlight.id = `${flight.id}/${index}`;
		newFlight.legId = index;

		result.push(newFlight);
	});

	return result;
};

function* worker({ payload }: SelectedFlightAction) {
	const { legId, flight } = payload;
	const isComplete: boolean = yield select(isLastLeg);
	const state: RootState = yield select();
	const selectedFlights = state.selectedFlights;
	const numOfLegs = state.legs.length;
	const actions: Action[] = [];

	if (flight.isRT) {
		// Split RT-flight into different flights objects by legs.
		// Each created flight will have it's own custom flight ID like `RT_flight_id/leg_id`.
		// Example: 1560410001/0, 1560410001/1
		const RTPieces = splitRTFlight(state.flights[flight.newFlightId]);

		// Save new flights to the global flights pool.
		actions.push(addFlights(RTPieces));

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

				actions.push(setSelectedFlight(i, newSelectedFlight));
			}
		}
	}
	else {
		actions.push(setSelectedFlight(legId, flight));
	}

	if (isComplete) {
		if (flight.isRT) {
			// Run one fare families search.
			yield put(searchFareFamiliesRT(flight.newFlightId));
		}
		else {
			// Run fare families search for the last selected flight.
			yield put(searchFareFamilies(legId, flight.newFlightId));

			// Run fare families searches for all previously selected flights.
			for (const legId in selectedFlights) {
				if (selectedFlights.hasOwnProperty(legId)) {
					yield put(searchFareFamilies(parseInt(legId), selectedFlights[legId].newFlightId));
				}
			}
		}
	}
	else {
		actions.push(nextLeg());
	}

	actions.push(hideFlights());

	yield put(batchActions(...actions));
	yield put(removeAllFilters());
}

export default function* selectFlightSaga() {
	yield takeEvery(SELECT_FLIGHT, worker);
}
