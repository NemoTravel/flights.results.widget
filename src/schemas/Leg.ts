import { Moment } from 'moment';
import { Airport } from '@nemo.travel/search-widget';

export default interface Leg {
	id: number;
	departure: Airport;
	arrival: Airport;
	date: Moment;
}
