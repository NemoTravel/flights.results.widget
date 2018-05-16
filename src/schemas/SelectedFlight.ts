import Money from './Money';

export interface FlightsReplacement {
	[originalFlightId: number]: SelectedFlight
}

export default interface SelectedFlight {
	price: Money;
	newFlightId: number;
	originalFlightId: number;
	isRT: boolean;
}
