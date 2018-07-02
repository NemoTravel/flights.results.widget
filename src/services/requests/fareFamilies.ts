import FareFamiliesCombinations from '../../schemas/FareFamiliesCombinations';
import { parse as parseFareFamilies } from '../parsers/fareFamilies';

export default async (flightId: string, nemoURL: string): Promise<FareFamiliesCombinations> => {
	const response = await fetch(`${nemoURL}index.php?go=orderAPI/get&uri=flight/fareFamilies/${flightId}`, {
		credentials: 'include'
	});

	return parseFareFamilies(await response.json(), flightId);
};
