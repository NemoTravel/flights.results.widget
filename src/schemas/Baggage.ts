import { PassengerType } from '../main';

export interface RealBaggage {
	description: string;
	measurement: string;
	passtype: PassengerType;
	text: string;
	value: number;
}

export default interface BaggageWrapper {
	array: RealBaggage[];
	measurement: string;
	text: string;
	value: number;
}
