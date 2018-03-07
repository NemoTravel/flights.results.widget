import Flight from '../schemas/Flight';
import Money from '../schemas/Money';
import FareFamiliesCombinations from '../schemas/FareFamiliesCombinations';
import { CommonThunkAction, PricesState } from '../state';
import { REQUEST_URL } from '../utils';
import { setFlightsByLeg } from './flightsByLegs/actions';
import { startLoading, stopLoading } from './isLoading/actions';
import { parse as parseResults } from '../services/parsers/results';
import { parse as parseFareFamilies } from '../services/parsers/fareFamilies';
import { addFlights } from './flights/actions';
import { setCombinations } from './alternativeFlights/fareFamiliesCombinations/actions';
import { setSelectedFamily } from './alternativeFlights/selectedFamilies/actions';
import { setPrices } from './prices/actions';

const getPriceForLeg = (legId: number, pricesByLeg: { [legId: number]: Money }): Money => {
	const price: Money = { amount: 0, currency: 'RUB' };

	for (const priceLegId in pricesByLeg) {
		if ((parseInt(priceLegId)) > legId && pricesByLeg.hasOwnProperty(priceLegId)) {
			price.amount += pricesByLeg[priceLegId].amount;
		}
	}

	return price;
};

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
			const pricesByLeg: PricesState = {};
			const minPriceOnLeg: { [legId: number]: Money } = {};

			results.forEach((flights: Flight[], legId: number): void => {
				pricesByLeg[legId] = {};

				if (legId > 0) {
					minPriceOnLeg[legId] = flights.reduce((minPrice: Money, flight: Flight) => {
						return (minPrice === null || flight.totalPrice.amount < minPrice.amount) ? flight.totalPrice : minPrice;
					}, null);
				}
			});

			results.forEach((flights: Flight[], legId: number): void => {
				flights.forEach(flight => {
					pricesByLeg[legId][flight.id] = {
						amount: flight.totalPrice.amount + getPriceForLeg(legId, minPriceOnLeg).amount,
						currency: flight.totalPrice.currency
					};
				});

				dispatch(addFlights(flights));
				dispatch(setFlightsByLeg(flights, legId));
			});

			dispatch(setPrices(pricesByLeg));
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
