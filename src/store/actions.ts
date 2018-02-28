import Flight from '../schemas/Flight';
import { CommonThunkAction } from '../state';
import { setFlightsByLeg } from './flightsByLegs/actions';
import { startLoading, stopLoading } from './isLoading/actions';
import { parse as parseResults } from '../services/parsers/results';
import { parse as parseFareFamilies } from '../services/parsers/fareFamilies';
import { addFlights } from './flights/actions';
import FareFamiliesCombinations from '../schemas/FareFamiliesCombinations';
import { setCombinations } from './alternativeFlights/fareFamiliesCombinations/actions';
import { selectFamily } from './alternativeFlights/selectedFamilies/actions';

export const startSearch = (): CommonThunkAction => {
	return (dispatch): void => {
		const firstSearchId = 217224;
		const secondSearchId = 217225;

		dispatch(startLoading());

		const promises = [ firstSearchId, secondSearchId ].map(searchId => {
			return fetch(`http://mlsd.ru:9876/?go=orderAPI/get&uri=flight/search/${searchId}`)
				.then((response: Response) => response.json())
				.then((response: any) => parseResults(response, searchId));
		});

		Promise.all(promises).then((results: Flight[][]) => {
			results.forEach((flights: Flight[], legId: number) => {
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
			return fetch(`http://mlsd.ru:9876/index.php?go=orderAPI/get&uri=flight/fareFamilies/${flightId}`)
				.then((response: Response) => response.json())
				.then((response: any) => parseFareFamilies(response, flightId));
		});

		Promise.all(promises).then((results: FareFamiliesCombinations[]) => {
			results.forEach((combinations, legId) => {
				dispatch(setCombinations(legId, combinations));
				const combination = combinations.initialCombination.split('_');
				combination.forEach((familyId, segmentId) => dispatch(selectFamily(legId, segmentId, familyId)));
			});

			dispatch(stopLoading());
		});
	};
};
