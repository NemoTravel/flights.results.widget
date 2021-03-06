import * as moment from 'moment';
import FlightSchema from '../schemas/Flight';
import Airline from '../schemas/Airline';
import SegmentGroup from '../schemas/SegmentGroup';
import Segment from '../schemas/Segment';
import Money from '../schemas/Money';
import { convertNemoDateToMoment, declension, pluralize, UID_LEG_GLUE, UID_SEGMENT_GLUE } from '../utils';
import Date from '../schemas/Date';
import Fillable from '../models/Fillable';
import { i18n } from '../i18n';
import { ObjectsMap } from '../store/filters/selectors';

export default class Flight extends Fillable<FlightSchema> {
	id: string;
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
	searchIndex: string;

	uid: string; // XX767_1pc__XX767_2pc
	totalFlightTime: number;
	totalFlightTimeHuman: string;
	arrivalAtNextDay: boolean;
	firstSegment: Segment;
	lastSegment: Segment;
	transferInfo: string;
	isRT: boolean = false;
	legId: number;
	airlinesList: Airline[];

	fill(flightSource: FlightSchema): void {
		super.fill(flightSource);

		const UID: string[] = [];
		const airlinesMap: ObjectsMap<Airline> = {};
		const airlinesInFlight: Airline[] = [];
		let totalFlightTime = 0;

		this.id = flightSource.id.toString();

		this.segmentGroups = flightSource.segmentGroups.map(group => {
			const legUID: string[] = [];

			group.segments = group.segments.map((segment: any): Segment => {
				// Convert dates from Nemo object to a Moment.js object.
				if ('offsetUTC' in segment.arrDate) {
					segment.arrDate = convertNemoDateToMoment(<Date>segment.arrDate);
				}

				if ('offsetUTC' in segment.depDate) {
					segment.depDate = convertNemoDateToMoment(<Date>segment.depDate);
				}

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

			// Pull airline object from segment.
			if (!airlinesMap.hasOwnProperty(segment.airline.IATA)) {
				airlinesMap[segment.airline.IATA] = segment.airline;
				airlinesInFlight.push(segment.airline);
			}
		});

		this.airlinesList = airlinesInFlight;
		this.totalFlightTime = totalFlightTime;
		this.totalFlightTimeHuman = moment.duration(totalFlightTime, 'seconds').format(`d [${i18n('utils-dates-d')}] h [${i18n('utils-dates-h')}] m [${i18n('utils-dates-m')}]`);

		this.firstSegment = this.segments[0];
		this.lastSegment = this.segments[this.segments.length - 1];
		this.arrivalAtNextDay = this.firstSegment.depDate.date() !== this.lastSegment.arrDate.date();

		const numOfTransfers = this.segments.length - 1;
		const pluralizedTitle = pluralize(numOfTransfers, i18n('results-flight-transfersTitle_1'), i18n('results-flight-transfersTitle_2'), i18n('results-flight-transfersTitle_3'));

		this.transferInfo = `${numOfTransfers} ${pluralizedTitle}`;

		if (numOfTransfers === 1) {
			this.transferInfo += ` ${i18n('utils-pre-in')} ${declension(this.segments[0].arrAirport.city.name)}`;
		}

		this.searchIndex = this.uid.toLowerCase() +
			this.validatingCarrier.name.toLowerCase() +
			this.validatingCarrier.nameEn.toLowerCase() +
			this.firstSegment.depAirport.IATA.toLowerCase() +
			this.firstSegment.depAirport.name.toLowerCase() +
			this.firstSegment.depAirport.city.name.toLowerCase() +
			this.lastSegment.arrAirport.IATA.toLowerCase() +
			this.lastSegment.arrAirport.name.toLowerCase() +
			this.lastSegment.arrAirport.city.name.toLowerCase();
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
