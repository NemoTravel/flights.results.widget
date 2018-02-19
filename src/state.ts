import Flight from './schemas/Flight';

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

export enum FlightTimeType {
	Night = '00:00-06:00',
	Morning = '06:00-12:00',
	Noon = '12:00-18:00',
	Evening = '18:00-00:00'
}

export interface TimeFilterState {
	[LocationType.Arrival]: FlightTimeType[];
	[LocationType.Departure]: FlightTimeType[];
}

export interface FiltersState {
	airlines: string[];
	directOnly: boolean;
	airports: AirportsFilterState;
	time: TimeFilterState;
}

export interface ApplicationState {
	isLoading: boolean;
	config: Config;
	flights: Flight[];
	filters: FiltersState;
}
