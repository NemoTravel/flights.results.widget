import { createSelector } from 'reselect';
import Flight from '../../models/Flight';
import { getFlightsForCurrentLeg } from '../flights/selectors';
import { MAX_VISIBLE_FLIGHTS } from '../../utils';
import { getShowAllFlights, getVisibleFlights } from '../selectors';

export const showAllIsVisible = createSelector(
	[getShowAllFlights, getFlightsForCurrentLeg, getVisibleFlights],
	(showAllFlights: boolean, allFlights: Flight[], visibleFlights: Flight[]): boolean => {
		return !showAllFlights && allFlights.length > MAX_VISIBLE_FLIGHTS && !(visibleFlights.length < MAX_VISIBLE_FLIGHTS);
	}
);
