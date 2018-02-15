import { Action } from 'redux';
import { Config } from '../../state';

export const SET_CONFIG = 'SET_CONFIG';

export interface SetConfigAction extends Action {
	payload: Config;
}

export const setConfig = (config: Config): SetConfigAction => {
	return {
		type: SET_CONFIG,
		payload: config
	};
};
