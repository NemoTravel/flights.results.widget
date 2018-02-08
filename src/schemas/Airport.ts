import Country from './Country';
import City from './City';
import CommonModel from './CommonModel';

export default interface Airport extends CommonModel {
	IATA: string;
	country: Country;
	city: City;
}
