import Flight from '../schemas/Flight';
import { CommonThunkAction } from '../state';
import { setFlightsByLeg } from './flightsByLegs/actions';
import { startLoading, stopLoading } from './isLoading/actions';
import loadSearchResults from '../services/requests/results';
import loadFareFamilies from '../services/requests/fareFamilies';
import { addFlights } from './flights/actions';
import { setCombinations } from './alternativeFlights/fareFamiliesCombinations/actions';
import { setSelectedFamily } from './alternativeFlights/selectedFamilies/actions';
import { addFlightsRT } from './flightsRT/actions';

export const startSearch = (): CommonThunkAction => {
	return (dispatch): void => {
		const firstSearchId = 218644;
		const secondSearchId = 218646;
		const RTSearchId = 218647;
		const RT_LEG_INDEX = 2;

		dispatch(startLoading());

		Promise
			.all([
				loadSearchResults(firstSearchId),
				loadSearchResults(secondSearchId),
				loadSearchResults(RTSearchId)
			])
			.then(results => {
				results.forEach((flights: Flight[], legId: number): void => {
					if (legId === RT_LEG_INDEX) {
						dispatch(addFlightsRT(flights));
					}
					else {
						dispatch(addFlights(flights));
						dispatch(setFlightsByLeg(flights, legId));
					}
				});

				dispatch(stopLoading());
			}
		);
	};
};

export const searchForAlternativeFlights = (): CommonThunkAction => {
	return (dispatch, getState): void => {
		const state = getState();
		const selectedFlights = state.selectedFlights;
		const flightIds: number[] = [];

		dispatch(startLoading());

		for (const legId in selectedFlights) {
			if (selectedFlights.hasOwnProperty(legId)) {
				flightIds.push(selectedFlights[legId]);
			}
		}

		Promise
			.all(flightIds.map(loadFareFamilies))
			.then(results => {
				results.forEach((combinations, legId) => {
					dispatch(setCombinations(legId, combinations));
					const combination = combinations ? combinations.initialCombination.split('_') : [];
					combination.forEach((familyId, segmentId) => dispatch(setSelectedFamily(legId, segmentId, familyId)));
				});

				dispatch(stopLoading());
			}
		);
	};
};
