import Segment from '../Segment';
import { getBaggage } from './Baggage';
import { getAirline } from './Airline';

export const getSegment = (): Segment => {
	return {
		aircraft: null,
		airline: getAirline(),
		arrAirport: null,
		arrDate: null,
		arrTerminal: null,
		bookingClass: null,
		depAirport: null,
		depDate: null,
		depTerminal: null,
		flightNumber: '000',
		flightTime: null,
		groupNumber: null,
		isCharter: null,
		isLowCost: null,
		luggage: getBaggage(),
		maxSide: null,
		mealType: null,
		nextSegment: null,
		number: null,
		operatingAirline: null,
		prevSegment: null,
		seatsAvailable: null,
		stayingTime: null,
		stopAirports: null,
		stopPoints: null,
		stopQuantity: null,
		sunPercentLeft: null,
		sunPercentRight: null,
		fareFamily: null,
		waitingTime: 3600
	};
};
