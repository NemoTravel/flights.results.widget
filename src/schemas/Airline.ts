import CommonModel from './CommonModel';
import Country from './Country';
import Image from './Image';

export default interface Airline extends CommonModel {
	IATA: string;
	companyColor: string;
	companyColorAdditional: string;
	country: Country;
	logo: Image[];
	logoIcon: string;
	monochromeLogo: string;
	monochromeLogoIcon: string;
	rating: number;
}
