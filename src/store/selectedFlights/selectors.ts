import { createSelector } from 'reselect';
import { ApplicationState, FlightsState, SelectedFlightsState } from '../../state';
import { getFlightsPool } from '../filters/selectors';
import Money from '../../schemas/Money';

export const getSelectedFlightsIds = (state: ApplicationState): SelectedFlightsState => state.selectedFlights;

export const getTotalPrice = createSelector(
	[getSelectedFlightsIds, getFlightsPool],
	(selectedFlightsIds: SelectedFlightsState, flightsPool: FlightsState): Money => {
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
