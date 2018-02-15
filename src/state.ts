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

export interface FiltersState {
	airlines: string[];
	directOnly: boolean;
	airports: AirportsFilterState;
}

export interface ApplicationState {
	isLoading: boolean;
	config: Config;
	flights: Flight[];
	filters: FiltersState;
}
