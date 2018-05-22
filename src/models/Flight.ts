import * as moment from 'moment';
import FlightSchema from '../schemas/Flight';
import Airline from '../schemas/Airline';
import SegmentGroup from '../schemas/SegmentGroup';
import Segment from '../schemas/Segment';
import Money from '../schemas/Money';
import { convertNemoDateToMoment, declension, pluralize, UID_LEG_GLUE, UID_SEGMENT_GLUE } from '../utils';
import Date from '../schemas/Date';
import Fillable from '../models/Fillable';

export default class Flight extends Fillable<FlightSchema> implements FlightSchema {
	id: number;
	altFlightHasBeenChosen: boolean;
	altFlights: Flight[];
	codeShareAirlines: Airline[];
	isInternational: boolean;
	isRefundable: boolean;
	isTranslitRequired: boolean;
	originalCurrency: string;
	searchId: number;
	segmentGroups: SegmentGroup[];
	segments: Segment[];
	service: string;
	serviceFltId: string;
	totalPrice: Money;
	validatingCarrier: Airline;

	uid: string; // XX767_1pc__XX767_2pc
	totalFlightTime: number;
	totalFlightTimeHuman: string;
	arrivalAtNextDay: boolean;
	firstSegment: Segment;
	lastSegment: Segment;
	transferInfo: string;
	isRT: boolean = false;
	legId: number;

	fill(flightSource: FlightSchema): void {
		super.fill(flightSource);

		const UID: string[] = [];
		let totalFlightTime = 0;

		this.segmentGroups = flightSource.segmentGroups.map(group => {
			const legUID: string[] = [];

			group.segments = group.segments.map((segment: any): Segment => {
				// Convert dates from Nemo object to a Moment.js object.
				segment.arrDate = convertNemoDateToMoment(segment.arrDate as Date);
				segment.depDate = convertNemoDateToMoment(segment.depDate as Date);

				// Generate UID for each segment.
				legUID.push(this.createSegmentUID(segment as Segment));

				return segment;
			});

			// Glue together all segment UIDs.
			UID.push(legUID.join(UID_SEGMENT_GLUE));

			return group;
		});

		// Glue together all leg UIDs.
		this.uid = UID.join(UID_LEG_GLUE);

		this.segments.forEach(segment => {
			totalFlightTime += segment.flightTime + segment.waitingTime;
		});

		this.totalFlightTime = totalFlightTime;
		this.totalFlightTimeHuman = moment.duration(totalFlightTime, 'seconds').format('d [д] h [ч] m [мин]');

		this.firstSegment = this.segments[0];
		this.lastSegment = this.segments[this.segments.length - 1];
		this.arrivalAtNextDay = this.firstSegment.depDate.date() !== this.lastSegment.arrDate.date();

		const numOfTransfers = this.segments.length - 1;

		this.transferInfo = `${numOfTransfers} ${pluralize(numOfTransfers, 'пересадка', 'пересадки', 'пересадок')}`;

		if (numOfTransfers === 1) {
			this.transferInfo += ` в ${declension(this.segments[0].arrAirport.city.name)}`;
		}
	}

	/**
	 * Create a part of flight Unique ID (UID) for each segment.
	 *
	 * XX-123_1pc (flight number on the segment + free baggage allowance on the segment).
	 *
	 * @param {Segment} segment
	 * @returns {string}
	 */
	protected createSegmentUID(segment: Segment): string {
		return `${segment.airline.IATA}-${segment.flightNumber}_${segment.luggage.value === null ? 0 : segment.luggage.value}${segment.luggage.measurement}`;
	}
}
