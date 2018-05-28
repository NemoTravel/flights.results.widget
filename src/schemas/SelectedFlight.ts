import Money from './Money';

export interface FlightsReplacement {
	[originalFlightId: string]: SelectedFlight
}

export default interface SelectedFlight {
	price: Money;
	newFlightId: string;
	originalFlightId: string;
	isRT: boolean;
}
