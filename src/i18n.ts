import { Language } from './enums';
import I18nPool from './schemas/I18nPool';

let locale = Language.English;
let poolCache: I18nPool = {};

export const init = (newLocale: Language, extender?: I18nPool): void => {
	locale = newLocale;

	if (typeof extender === 'object' && Object.keys(extender).length) {
		poolCache = { ...poolCache, ...extender };
	}
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
