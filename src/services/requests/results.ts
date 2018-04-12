import Flight from '../../schemas/Flight';
import { REQUEST_URL } from '../../utils';
import { parse as parseResults } from '../parsers/results';

export default async (requestParams: any): Promise<Flight[]> => {
	const data = new FormData();
	data.append('data', JSON.stringify(requestParams));

	const response = await fetch(`${REQUEST_URL}?go=orderAPI/get&uri=flight/search/run`, {
		method: 'post',
		body: data
	});

	return parseResults(await response.json(), requestParams);
};
