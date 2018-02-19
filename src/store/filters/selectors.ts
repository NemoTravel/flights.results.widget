import { ApplicationState } from '../../state';
import Flight from '../../schemas/Flight';

export interface ListOfSelectedCodes {
	[code: string]: boolean;
}

export interface ObjectWithIATA {
	IATA: string;
}

export interface ObjectsMap<T> {
	[IATA: string]: T;
}

/**
 * Get an array of all flights.
 *
 * @param {ApplicationState} state
 * @returns {Flight[]}
 */
export const getFlights = (state: ApplicationState): Flight[] => state.flights;

/**
 * Get an object with selected codes used for filtering (airlines and airports filters).
 *
 * @param {string[]} codes
 * @returns {ListOfSelectedCodes}
 */
export const getListOfSelectedCodes = (codes: string[]): ListOfSelectedCodes => {
	const defaultList: ListOfSelectedCodes = {};

	return codes.reduce((result: ListOfSelectedCodes, code: string): ListOfSelectedCodes => {
		return {
			...result,
			[code]: true
		};
	}, defaultList);
};

/**
 * Create a map of `objectCode` => `objectInstance`.
 * Used for creating a set of selected objects used for filtering (set of airports or airlines).
 *
 * @param {[]} objects
 * @returns {ObjectsMap}
 */
export const createMap = <T extends ObjectWithIATA>(objects: T[]): ObjectsMap<T> => {
	const defaultMap: ObjectsMap<T> = {};

	return objects.reduce((result: ObjectsMap<T>, object: T): ObjectsMap<T> => {
		return {
			...result,
			[object.IATA]: object
		};
	}, defaultMap);
};
