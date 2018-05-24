import Airline from './Airline';
import Money from './Money';
import Segment from './Segment';
import SegmentGroup from './SegmentGroup';
import FlightModel from '../models/Flight';

export default interface Flight {
	id: number;
	altFlightHasBeenChosen: boolean;
	altFlights: FlightModel[];
	codeShareAirlines: Airline[];
	isInternational: boolean;
	isRefundable: boolean;
	isTranslitRequired: boolean;
	originalCurrency: string;
	searchId: number;
	searchIndex: string;
	segmentGroups: SegmentGroup[];
	segments: Segment[];
	service: string;
	serviceFltId: string;
	totalPrice: Money;
	validatingCarrier: Airline;
}
