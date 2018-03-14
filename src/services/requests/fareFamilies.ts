import FareFamiliesCombinations from '../../schemas/FareFamiliesCombinations';
import { REQUEST_URL } from '../../utils';
import { parse as parseFareFamilies } from '../parsers/fareFamilies';

export default async (flightId: number): Promise<FareFamiliesCombinations> => {
	const response = await fetch(`${REQUEST_URL}index.php?go=orderAPI/get&uri=flight/fareFamilies/${flightId}`);

	return parseFareFamilies(await response.json(), flightId);
};
