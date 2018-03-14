import { Action } from 'redux';
import { CommonThunkAction } from '../../state';
import { setSelectedFlight } from '../selectedFlights/actions';
import { setCombinations } from '../alternativeFlights/fareFamiliesCombinations/actions';
import { clearAllFilters } from '../filters/actions';

export const NEXT_LEG = 'NEXT_LEG';
export const SET_LEG = 'SET_LEG';

export interface LegAction extends Action {
	payload?: number;
}

export const nextLeg = (): LegAction => {
	return {
		type: NEXT_LEG
	};
};

export const setLeg = (legId: number): LegAction => {
	return {
		type: SET_LEG,
		payload: legId
	};
};

export const goToLeg = (newLegId: number): CommonThunkAction => {
	return (dispatch, getState): void => {
		const selectedFlights = getState().selectedFlights;

		for (const legId in selectedFlights) {
			const numberedLegId = parseInt(legId);

			if (selectedFlights.hasOwnProperty(legId) && numberedLegId > newLegId) {
				dispatch(setSelectedFlight(null, numberedLegId));
				dispatch(setCombinations(numberedLegId, null));
			}
		}

		dispatch(clearAllFilters());
		dispatch(setSelectedFlight(null, newLegId));
		dispatch(setLeg(newLegId));
	};
};
