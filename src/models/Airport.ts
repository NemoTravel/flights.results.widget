import AirportSchema from '../schemas/Airport';

export default class Airport implements AirportSchema {
	id = null;
	IATA = null;
	name = null;
	nameEn = null;
	country = null;
	city = null;

	constructor({ id, IATA, country, city }: AirportSchema) {
		this.id = id;
		this.IATA = IATA;
	}
}
