import Aircraft from './Aircraft';
import Airline from './Airline';
import Airport from './Airport';
import BookingClass from './BookingClass';
import Baggage from './Baggage';
import { Moment } from 'moment';

export default interface Segment {
	aircraft: Aircraft;
	airline: Airline;
	arrAirport: Airport;
	arrDate: Moment;
	arrTerminal: string;
	bookingClass: BookingClass;
	depAirport: Airport;
	depDate: Moment;
	depTerminal: string;
	flightNumber: string;
	flightTime: number;
	groupNumber: number;
	isCharter: boolean;
	isLowCost: boolean;
	luggage: Baggage;
	maxSide: string;
	mealType: string;
	nextSegment: Segment;
	number: number;
	operatingAirline: Airline;
	prevSegment: Segment;
	seatsAvailable: number;
	stayingTime: number;
	stopAirports: Airport[];
	stopPoints: string;
	stopQuantity: number;
	sunPercentLeft: number;
	sunPercentRight: number;
	tariffFeatures: any;
	waitingTime: number;
}
