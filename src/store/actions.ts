import Flight from '../schemas/Flight';
import FareFamiliesCombinations from '../schemas/FareFamiliesCombinations';
import { CommonThunkAction } from '../state';
import { REQUEST_URL } from '../utils';
import { setFlightsByLeg } from './flightsByLegs/actions';
import { startLoading, stopLoading } from './isLoading/actions';
import { parse as parseResults } from '../services/parsers/results';
import { parse as parseFareFamilies } from '../services/parsers/fareFamilies';
import { addFlights } from './flights/actions';
import { setCombinations } from './alternativeFlights/fareFamiliesCombinations/actions';
import { setSelectedFamily } from './alternativeFlights/selectedFamilies/actions';

export const startSearch = (): CommonThunkAction => {
	return (dispatch): void => {
		const firstSearchId = 218644;
		const secondSearchId = 218646;
		// const RTSearchId = 218647;

		dispatch(startLoading());

		const promises = [ firstSearchId, secondSearchId ].map(searchId => (
			fetch(`${REQUEST_URL}?go=orderAPI/get&uri=flight/search/${searchId}`)
				.then((response: Response) => response.json())
				.then((response: any) => parseResults(response, searchId))
		));

		Promise.all(promises).then((results: Flight[][]) => {
			results.forEach((flights: Flight[], legId: number): void => {
				dispatch(addFlights(flights));
				dispatch(setFlightsByLeg(flights, legId));
			});

			dispatch(stopLoading());
		});
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

		const promises = flightIds.map(flightId => {
			return fetch(`${REQUEST_URL}index.php?go=orderAPI/get&uri=flight/fareFamilies/${flightId}`)
				.then((response: Response) => response.json())
				.then((response: any) => parseFareFamilies(response, flightId));
		});

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
