import Airline from '../Airline';

export const getAirline = (): Airline => {
	return {
		id: null,
		name: null,
		nameEn: null,
		IATA: 'XX',
		companyColor: null,
		companyColorAdditional: null,
		country: null,
		logo: null,
		logoIcon: null,
		monochromeLogo: null,
		monochromeLogoIcon: null,
		rating: null
	};
};
