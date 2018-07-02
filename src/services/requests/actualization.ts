import { Language } from '../../enums';
import { parse } from '../parsers/actualization';
import AvailabilityInfo from '../../schemas/AvailabilityInfo';

export default async (flightId: string, locale: Language, nemoURL: string): Promise<AvailabilityInfo> => {
	const response = await fetch(`${nemoURL}index.php?go=orderAPI/get&uri=flight/actualization/${flightId}&apilang=${locale}`, {
		credentials: 'include'
	});

	return parse(await response.json(), flightId);
};
