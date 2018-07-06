import { Language } from '../../enums';
import { parse } from '../parsers/searchInfo';
import { SearchInfo } from '@nemo.travel/search-widget';

export default async (searchResultsId: string, locale: Language, nemoURL: string): Promise<SearchInfo> => {
	const response = await fetch(`${nemoURL}index.php?go=orderAPI/get&uri=flight/search/info/${searchResultsId}&apilang=${locale}`, {
		credentials: 'include'
	});

	return parse(await response.json(), searchResultsId);
};
