import { Language } from './enums';

let locale = Language.English;
const poolCache: { [key: string]: string } = {};

export const init = (newLocale: Language): void => {
	locale = newLocale;
};

export const i18n = (key: string): string => {
	if (poolCache[key]) {
		return poolCache[key];
	}

	const pool = require(`./i18n/${locale}.json`);
	let result = key;

	if (pool[key]) {
		result = pool[key];
		poolCache[key] = result;
	}

	return result;
};
