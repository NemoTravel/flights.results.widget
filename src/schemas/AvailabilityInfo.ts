import Flight from '../models/Flight';
import Money from './Money';

export interface PriceInfo {
	hasChanged: boolean;
	oldPrice: Money;
	newPrice: Money;
}

export default interface AvailabilityInfo {
	flight: Flight;
	isAvailable: boolean;
	priceInfo: PriceInfo;
	orderLink: string;
}
