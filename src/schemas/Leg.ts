import { Moment } from 'moment';
import { Airport } from '@nemo.travel/search-widget/src/services/models/Airport';

export default interface Leg {
	id: number;
	departure: Airport;
	arrival: Airport;
	date: Moment;
}
