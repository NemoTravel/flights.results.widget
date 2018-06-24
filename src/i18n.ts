import { Language } from './enums';

let locale = Language.English;

export const init = (newLocale: Language): void => {
	locale = newLocale;
};

export const i18n = (key: string): string => {
	const pool = require(`./i18n/${locale}.json`);

	return pool[key] ? pool[key] : key;
};
