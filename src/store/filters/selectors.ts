import { ApplicationState } from '../../state';
import Flight from '../../schemas/Flight';

export interface ListOfSelectedCodes {
	[IATA: string]: boolean;
}

export interface ObjectWithIATA {
	IATA: string;
}

export interface ObjectsMap<T> {
	[IATA: string]: T;
}

export const getFlights = (state: ApplicationState): Flight[] => state.flights;

export const getListOfSelectedCodes = (codes: string[]): ListOfSelectedCodes => {
	const defaultList: ListOfSelectedCodes = {};

	return codes.reduce((result: ListOfSelectedCodes, code: string): ListOfSelectedCodes => {
		return {
			...result,
			[code]: true
		};
	}, defaultList);
};

export const createMap = <T extends ObjectWithIATA>(objects: T[]): ObjectsMap<T> => {
	const defaultMap: ObjectsMap<T> = {};

	return objects.reduce((result: ObjectsMap<T>, object: T): ObjectsMap<T> => {
		return {
			...result,
			[object.IATA]: object
		};
	}, defaultMap);
};
