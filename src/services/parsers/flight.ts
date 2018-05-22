import Flight from '../../models/Flight';

/**
 * Convert API object to the FlightModel object.
 *
 * @param flightFromResponse
 * @returns {Flight}
 */
export const parse = (flightFromResponse: any): Flight => {
	return new Flight(flightFromResponse);
};
