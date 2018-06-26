import { REQUEST_URL } from '../../utils';
import { Language } from '../../enums';
import { parse } from '../parsers/actualization';
import AvailabilityInfo from '../../schemas/AvailabilityInfo';

export default async (flightId: string, locale: Language): Promise<AvailabilityInfo> => {
	const response = await fetch(`${REQUEST_URL}index.php?go=orderAPI/get&uri=flight/actualization/${flightId}&apilang=${locale}`);

	return parse(await response.json(), flightId);
};
