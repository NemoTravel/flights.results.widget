import Money from './Money';

export interface PricesByLegs {
	[legId: number]: Money;
}
