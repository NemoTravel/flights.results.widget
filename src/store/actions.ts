import Flight from '../schemas/Flight';
import FareFamiliesCombinations from '../schemas/FareFamiliesCombinations';
import { CommonThunkAction } from '../state';
import { setFlightsByLeg } from './flightsByLegs/actions';
import { startLoading, stopLoading } from './isLoading/actions';
import { load as loadSearchResults } from '../services/requests/results';
import { load as loadFareFamilies } from '../services/requests/fareFamilies';
import { addFlights } from './flights/actions';
import { setCombinations } from './alternativeFlights/fareFamiliesCombinations/actions';
import { setSelectedFamily } from './alternativeFlights/selectedFamilies/actions';

export const startSearch = (): CommonThunkAction => {
	return (dispatch): void => {
		const firstSearchId = 218644;
		const secondSearchId = 218646;
		const RTSearchId = 218647;

		dispatch(startLoading());

		Promise
			.all([
				loadSearchResults(firstSearchId),
				loadSearchResults(secondSearchId),
				loadSearchResults(RTSearchId)
			])
			.then((results: Flight[][]) => {
				results.forEach((flights: Flight[], legId: number): void => {
					dispatch(addFlights(flights));
					dispatch(setFlightsByLeg(flights, legId));
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

		const promises = flightIds.map(loadFareFamilies);

		Promise.all(promises).then((results: FareFamiliesCombinations[]) => {
			results.forEach((combinations, legId) => {
				dispatch(setCombinations(legId, combinations));
				const combination = combinations ? combinations.initialCombination.split('_') : [];
				combination.forEach((familyId, segmentId) => dispatch(setSelectedFamily(legId, segmentId, familyId)));
			});

			dispatch(stopLoading());
		});
	};
};
