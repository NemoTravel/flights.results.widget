import CommonModel from './CommonModel';
import Country from './Country';

export default interface City extends CommonModel {
	nameOriginal: string;
	country: Country;
}
