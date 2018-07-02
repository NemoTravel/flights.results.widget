import Flight from '../../models/Flight';
import { ISO_DATE_LENGTH } from '../../utils';
import { parse as parseResults } from '../parsers/results';
import RequestInfo from '../../schemas/RequestInfo';
import { Language } from '../../enums';

export default async (requestParams: RequestInfo, locale: Language, nemoURL: string): Promise<Flight[]> => {
	const data = new FormData();

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

	const response = await fetch(`${nemoURL}index.php?go=orderAPI/get&uri=flight/search/run&apilang=${locale}`, {
		method: 'post',
		body: data,
		credentials: 'include'
	});

	return parseResults(await response.json());
};
