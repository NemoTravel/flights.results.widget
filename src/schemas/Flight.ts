import CommonModel from './CommonModel';
import Airline from './Airline';
import Money from './Money';
import Segment from './Segment';
import SegmentGroup from './SegmentGroup';

export default interface Flight extends CommonModel {
	altFlightHasBeenChosen: boolean;
	altFlights: Flight[];
	codeShareAirlines: Airline[];
	isInternational: boolean;
	isRefundable: false;
	isTranslitRequired: true;
	originalCurrency: string;
	searchId: number;
	segmentGroups: SegmentGroup[];
	segments: Segment[];
	service: string;
	serviceFltId: string;
	tariffFeatures: any;
	totalPrice: Money;
	validatingCarrier: Airline;
}
