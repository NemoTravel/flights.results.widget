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
		const commonParams = {
			passengers: [ { type: 'ADT', count: 1 } ],
			parameters: {
				direct: false,
				aroundDates: 0,
				serviceClass: 'Economy',
				delayed: false
			}
		};

		const firstSegment = {
			departure: { IATA: 'MOW', isCity: true },
			arrival: { IATA: 'LED', isCity: false },
			departureDate: '2018-05-25T00:00:00'
		};

		const secondSegment = {
			departure: { IATA: 'LED', isCity: false },
			arrival: { IATA: 'MOW', isCity: false },
			departureDate: '2018-05-26T00:00:00'
		};

		const legs = [
			{ segments: [ firstSegment ], ...commonParams },
			{ segments: [ secondSegment ], ...commonParams }
		];

		const RTLeg = { segments: [ firstSegment, secondSegment ], ...commonParams };

		dispatch(startLoading());

		loadSearchResults(RTLeg).then(results => dispatch(addFlightsRT(results)));

		// Process one way results on each leg.
		Promise
			.all(legs.map(loadSearchResults))
			.then(results => {
				results.forEach((flights: Flight[], index: number): void => {
					dispatch(addFlights(flights));
					dispatch(setFlightsByLeg(flights, index));
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
			});
	};
};
