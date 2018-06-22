import { RootState } from '../../reducers';
import { createSelector } from 'reselect';
import { getAllAirlines, getSelectedAirlinesObjects } from '../airlines/selectors';
import { getAirlinesIATA, getSelectedFlights } from '../../selectedFlights/selectors';
import { getDepartureAirports, getSelectedDepartureAirportsObjects } from '../airports/selectors';
import Airline from '../../../schemas/Airline';
import Flight from '../../../models/Flight';
import Airport from '../../../schemas/Airport';
import { isFirstLeg } from '../../currentLeg/selectors';

export const getIsComfortable = (state: RootState): boolean => state.filters.comfortable;

const isNeededAirlinesExists = createSelector(
	[
		getSelectedAirlinesObjects,
		getAllAirlines,
		getSelectedFlights
	],
	(
		selectedAirlines: Airline[],
		allAirlinesInLeg: Airline[],
		selectedFlights: Flight[]
	): boolean => {
		const airlinesIATA = getAirlinesIATA(selectedFlights),
			filteredAirlines = selectedAirlines.length ? selectedAirlines : allAirlinesInLeg;

		return !!filteredAirlines.find(airline => {
			return airlinesIATA.hasOwnProperty(airline.IATA);
		});
	}
);

const isNeededAirportExists = createSelector(
	[
		getSelectedDepartureAirportsObjects,
		getDepartureAirports,
		getSelectedFlights
	],
	(
		selectedDepartureAirports: Airport[],
		departureAirports: Airport[],
		selectedFlights: Flight[]
	): boolean => {
		const prevLegArrival = selectedFlights.length ? selectedFlights[selectedFlights.length - 1].lastSegment.arrAirport.IATA : null,
			filteredAirports = selectedDepartureAirports.length ? selectedDepartureAirports : departureAirports;

		return !!filteredAirports.find(airline => {
			return airline.IATA === prevLegArrival;
		});
	}
);

export const isComfortableFilterEnabled = createSelector(
	[isFirstLeg, isNeededAirlinesExists, isNeededAirportExists],
	(isFirstLeg: boolean, isAirlineExists: boolean, isAirportExists: boolean): boolean => !isFirstLeg && isAirlineExists && isAirportExists
);
