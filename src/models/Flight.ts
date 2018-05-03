import * as moment from 'moment';
import FlightSchema from '../schemas/Flight';
import Airline from '../schemas/Airline';
import SegmentGroup from '../schemas/SegmentGroup';
import Segment from '../schemas/Segment';
import Money from '../schemas/Money';
import { convertNemoDateToMoment, declension, UID_LEG_GLUE, UID_SEGMENT_GLUE } from '../utils';
import Date from '../schemas/Date';

export default class Flight implements FlightSchema {
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
	transferInfo: string[];

	constructor(flightSource: FlightSchema) {
		this.fill(flightSource);
	}

	fill(flightSource: FlightSchema): void {
		const UID: string[] = [];
		let totalFlightTime = 0;

		this.id = flightSource.id;
		this.altFlightHasBeenChosen = flightSource.altFlightHasBeenChosen;
		this.altFlights = flightSource.altFlights;
		this.codeShareAirlines = flightSource.codeShareAirlines;
		this.isInternational = flightSource.isInternational;
		this.isRefundable = flightSource.isRefundable;
		this.isTranslitRequired = flightSource.isTranslitRequired;
		this.originalCurrency = flightSource.originalCurrency;
		this.searchId = flightSource.searchId;
		this.segments = flightSource.segments;
		this.service = flightSource.service;
		this.serviceFltId = flightSource.serviceFltId;
		this.totalPrice = flightSource.totalPrice;
		this.validatingCarrier = flightSource.validatingCarrier;

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

		this.transferInfo = this.segments.slice(0, this.segments.length - 1).map(segment => {
			const waitingTime = moment.duration(segment.waitingTime, 'seconds').format('d [д] h [ч] m [мин]');

			return `${waitingTime} пересадка в ${declension(segment.arrAirport.city.name)}`;
		});
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
