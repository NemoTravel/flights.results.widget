import { createSelector } from 'reselect';
import { ApplicationState, FlightsState, SelectedFlightsState } from '../../state';
import { getFlightsPool } from '../flights/selectors';
import Money from '../../schemas/Money';

export const getSelectedFlightsIds = (state: ApplicationState): SelectedFlightsState => {
	return state.selectedFlights;
};

export const getTotalPrice = createSelector(
	[getFlightsPool, getSelectedFlightsIds],
	(flightsPool: FlightsState, selectedFlightsIds: SelectedFlightsState): Money => {

		const totalPrice: Money = {
			amount: 0,
			currency: 'RUB'
		};

		for (const legId in selectedFlightsIds) {
			if (selectedFlightsIds.hasOwnProperty(legId)) {
				const flightId = selectedFlightsIds[legId];

				if (flightsPool.hasOwnProperty(flightId)) {
					totalPrice.amount += flightsPool[flightId].totalPrice.amount;
				}
			}
		}

		return totalPrice;
	}
);
