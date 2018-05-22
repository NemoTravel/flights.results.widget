import Flight from '../../models/Flight';
import { ISO_DATE_LENGTH, REQUEST_URL } from '../../utils';
import { parse as parseResults } from '../parsers/results';
import RequestInfo from '../../schemas/RequestInfo';

export default async (requestParams: RequestInfo): Promise<Flight[]> => {
	const data = new FormData();
	let responseJSON = JSON.parse(localStorage.getItem(JSON.stringify(requestParams)));

	if (!responseJSON) {
		data.append('data', JSON.stringify({
			...requestParams,
			segments: requestParams.segments.map(segment => {
				const result: any = {
					departureDate: segment.departureDate.format().substr(0, ISO_DATE_LENGTH),
					departure: {
						IATA: segment.departure.IATA,
						isCity: !!segment.departure.isCity
					},
					arrival: {
						IATA: segment.arrival.IATA,
						isCity: !!segment.arrival.isCity
					}
				};

				if (segment.returnDate) {
					result.returnDate = segment.returnDate.format().substr(0, ISO_DATE_LENGTH);
				}

				return result;
			})
		}));

		const response = await fetch(`${REQUEST_URL}?go=orderAPI/get&uri=flight/search/run`, {
			method: 'post',
			body: data
		});

		responseJSON = await response.json();
		localStorage.setItem(JSON.stringify(requestParams), JSON.stringify(responseJSON));
	}

	return parseResults(responseJSON);
};
