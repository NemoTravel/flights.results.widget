import { SET_CONFIG, SetConfigAction } from './actions';
import { Language } from '../../enums';

export interface Config {
	rootElement: HTMLElement;
	locale: Language;
}

const initalConfig: Config = {
	rootElement: document.getElementById('root'),
	locale: Language.English
};

export const configReducer = (state: Config = initalConfig, action: SetConfigAction): Config => {
	switch (action.type) {
		case SET_CONFIG:
			return action.payload;
	}

	return state;
};
