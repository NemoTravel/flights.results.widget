import { CommonThunkAction } from '../state';
import { setFlightsByLeg } from './flightsByLegs/actions';
import { startLoading, stopLoading } from './isLoading/actions';
import Flight from '../schemas/Flight';
import { parse } from '../services/parsers/results';
import { addFlights } from './flights/actions';

export const startSearch = (): CommonThunkAction => {
	return (dispatch): void => {
		const firstSearchId = 216724;
		const secondSearchId = 216725;

		dispatch(startLoading());

		const promises = [ firstSearchId, secondSearchId ].map(searchId => {
			return fetch(`http://release.mlsd.ru/?go=orderAPI/get&uri=flight/search/${searchId}`)
				.then((response: Response) => response.json())
				.then((response: any) => parse(response, searchId));
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
