import { createSelector } from 'reselect';
import Leg from '../../schemas/Leg';
import { RootState } from '../reducers';
import { NUM_OF_RT_SEGMENTS } from '../../utils';

/**
 * Get all search legs.
 *
 * @param {RootState} state
 * @returns {Leg[]}
 */
export const getLegs = (state: RootState): Leg[] => state.legs;

export const isRT = createSelector(
	[getLegs],
	(legs: Leg[]): boolean => {
		let result = false;

		if (
			legs.length === NUM_OF_RT_SEGMENTS &&
			legs[0].departure.IATA === legs[1].arrival.IATA &&
			legs[0].arrival.IATA === legs[1].departure.IATA
		) {
			result = true;
		}

		return result;
	}
);
