import FareFamiliesCombinations from '../../schemas/FareFamiliesCombinations';
import { parse as parseFareFamilies } from '../parsers/fareFamilies';
import { Language } from '../../enums';

export default async (flightId: string, locale: Language, nemoURL: string): Promise<FareFamiliesCombinations> => {
	const response = await fetch(`${nemoURL}index.php?go=orderAPI/get&uri=flight/fareFamilies/${flightId}&apilang=${locale}`, {
		credentials: 'include'
	});

	return parseFareFamilies(await response.json(), flightId);
};
