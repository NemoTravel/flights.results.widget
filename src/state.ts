import { ThunkAction } from 'redux-thunk';
import Flight from './schemas/Flight';
import Leg from './schemas/Leg';

export type CommonThunkAction = ThunkAction<void, ApplicationState, null>;

export type GetStateFunction = () => ApplicationState;

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

export enum LocationType {
	Departure = 'departure',
	Arrival = 'arrival'
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

export interface SelectedFamiliesState {
	[segmentId: number]: number;
}

export interface AlternativeFlightsState {
	selectedFamilies: SelectedFamiliesState;
}

export interface ApplicationState {
	config: Config;
	currentLeg: number;
	filters: FiltersState;
	flights: FlightsState;
	flightsByLegs: FlightsByLegsState;
	isLoading: boolean;
	selectedFlights: SelectedFlightsState;
	alternativeFlights: AlternativeFlightsState;
	legs: Leg[];
}
