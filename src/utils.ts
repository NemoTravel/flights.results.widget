import { Language } from './state';

export const REQUEST_URL = 'http://mlsd.ru:9876/';

export const addCodeInList = (list: string[], code: string): string[] => {
	const result: string[] = [...list];

	if (!list.find(existingCode => existingCode === code)) {
		result.push(code);
	}

	return result;
};

export const removeCodeFromList = (list: string[], code: string): string[] => {
	return list.filter(existingCode => existingCode !== code);
};

export const declension = (word: string, language = Language.Russian): string => {
	if (language === Language.Russian) {
		const lastLetterIndex = word.length - 1;
		const lastLetter = word[lastLetterIndex];
		let newWord = word;
		let newSuffix: string;

		if (word === 'Казань' || word === 'Пермь') {
			newSuffix = 'и';
		}
		else if (/[аеёийоуыьэюя]/i.test(lastLetter)) {
			if (/[айь]/i.test(lastLetter)) {
				newSuffix = 'е';
			}
			else if (lastLetter === 'ы') {
				newSuffix = 'ах';
			}
		}
		else {
			newWord = word + 'е';
		}

		if (newSuffix) {
			newWord = word.substr(0, lastLetterIndex) + newSuffix;
		}

		return newWord;
	}

	return word;
};
