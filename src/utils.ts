import { Language } from './state';

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

		if (/[аеёийоуыьэюя]/i.test(lastLetter)) {
			if (/[айь]/i.test(lastLetter)) {
				newWord = word.substr(0, lastLetterIndex) + 'е';
			}
			else if (lastLetter === 'ы') {
				newWord = word.substr(0, lastLetterIndex) + 'ах';
			}
		}
		else {
			newWord = word + 'е';
		}

		return newWord;
	}

	return word;
};
