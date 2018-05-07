import { ThunkAction } from 'redux-thunk';
import Flight from './models/Flight';
import Leg from './schemas/Leg';
import FareFamiliesCombinations from './schemas/FareFamiliesCombinations';
import Money from './schemas/Money';

export type CommonThunkAction = ThunkAction<void, ApplicationState, null>;

export enum Language {
	Russian = 'ru',
	English = 'en'
}

export enum PassengerType {
	Adult = 'ADT',
	Child = 'CLD',
	Infant = 'INF',
	InfantWithSeat = 'INS'
}

export enum Currency {
	RUB = 'RUB'
}

export enum LocationType {
	Departure = 'departure',
	Arrival = 'arrival'
}

export enum SortingType {
	DepartureTime = 'DepartureTime',
	ArrivalTime = 'ArrivalTime',
	FlightTime = 'FlightTime',
	Price = 'Price'
}

export enum SortingDirection {
	ASC = 'ASC',
	DESC = 'DESC'
}

export interface Config {
	rootElement: HTMLElement;
	locale: Language;
}

export interface AirportsFilterState {
	[LocationType.Arrival]: string[];
	[LocationType.Departure]: string[];
}

export enum FlightTimeInterval {
	Night = '00:00-06:00',
	Morning = '06:00-12:00',
	Afternoon = '12:00-18:00',
	Evening = '18:00-00:00'
}

export interface TimeFilterState {
	[LocationType.Arrival]: FlightTimeInterval[];
	[LocationType.Departure]: FlightTimeInterval[];
}

export interface FiltersState {
	airlines: string[];
	directOnly: boolean;
	airports: AirportsFilterState;
	time: TimeFilterState;
}

export interface FlightsByLegsState {
	[legId: number]: number[];
}

export interface SelectedFlightsState {
	[legId: number]: number;
}

export interface FlightsState {
	[flightId: number]: Flight;
}

export interface FlightsRTState {
	[flightUID: string]: Flight;
}

export interface SelectedFamiliesSegmentCombination {
	[segmentId: number]: string;
}

export interface SelectedFamiliesState {
	[legId: number]: SelectedFamiliesSegmentCombination;
}

export interface FareFamiliesCombinationsState {
	[legId: number]: FareFamiliesCombinations;
}

export interface FareFamiliesPricesState {
	[legId: number]: {
		[segmentId: number]: {
			[familyId: string]: Money;
		};
	};
}

export interface FlightsPricesState {
	[flightId: number]: Money;
}

export interface PricesState {
	[legId: number]: FlightsPricesState;
}

export interface FareFamiliesAvailabilityState {
	[legId: number]: {
		[segmentId: number]: {
			[familyId: string]: boolean;
		};
	};
}

export interface AlternativeFlightsState {
	selectedFamilies: SelectedFamiliesState;
	fareFamiliesCombinations: FareFamiliesCombinationsState;
}

export interface SortingState {
	type: SortingType;
	direction: SortingDirection;
}

export interface ApplicationState {
	config: Config;
	currentLeg: number;
	filters: FiltersState;
	flights: FlightsState;
	flightsRT: FlightsRTState;
	prices: PricesState;
	flightsByLegs: FlightsByLegsState;
	isLoading: boolean;
	selectedFlights: SelectedFlightsState;
	alternativeFlights: AlternativeFlightsState;
	legs: Leg[];
	sorting: SortingState;
	showAllFlights: boolean;
}
