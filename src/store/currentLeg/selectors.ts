import { RootState } from '../reducers';
import { createSelector } from 'reselect';
import Leg from '../../schemas/Leg';

/**
 * Get current leg id.
 *
 * @param {RootState} state
 * @returns {number}
 */
export const getCurrentLegId = (state: RootState): number => state.currentLeg;

/**
 * Get all search legs.
 *
 * @param {RootState} state
 * @returns {Leg[]}
 */
export const getLegs = (state: RootState): Leg[] => state.legs;

/**
 * Get current active leg.
 */
export const getCurrentLeg = createSelector(
	[getCurrentLegId, getLegs],
	(currentLegId: number, legs: Leg[]): Leg => legs[currentLegId]
);

export const isMultipleLegs = createSelector(
	[getLegs],
	(legs: Leg[]): boolean => legs.length > 1
);

export const isLastLeg = createSelector(
	[getCurrentLegId, getLegs],
	(currentLegId: number, legs: Leg[]): boolean => currentLegId === legs.length - 1
);

export const isFirstLeg = createSelector(
	[getCurrentLegId],
	(currentLegId: number): boolean => currentLegId === 0
);
