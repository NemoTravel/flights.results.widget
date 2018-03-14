import Flight from '../../schemas/Flight';
import { REQUEST_URL } from '../../utils';
import { parse as parseResults } from '../parsers/results';

export default async (searchId: number): Promise<Flight[]> => {
	const response = await fetch(`${REQUEST_URL}?go=orderAPI/get&uri=flight/search/${searchId}`);

	return parseResults(await response.json(), searchId);
};
