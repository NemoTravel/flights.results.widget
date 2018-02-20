import { Moment } from 'moment';

export default interface Leg {
	id: number;
	departure: string;
	arrival: string;
	date: Moment;
}
