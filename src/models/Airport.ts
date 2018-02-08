import AirportSchema from '../schemas/Airport';
import City from '../schemas/City';
import Country from '../schemas/Country';

export default class Airport implements AirportSchema {
	id: number = null;
	IATA: string = null;
	name: string = null;
	nameEn: string = null;
	country: Country = null;
	city: City = null;

	constructor({ id, IATA, country, city }: AirportSchema) {
		this.id = id;
		this.IATA = IATA;
	}
}
