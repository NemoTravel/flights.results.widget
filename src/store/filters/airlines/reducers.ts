import {
	FilterAirlinesAction,
	FILTERS_ADD_AIRLINE,
	FILTERS_REMOVE_AIRLINE,
	FILTERS_REMOVE_ALL_AIRLINES
} from './actions';
import { addCodeInList, removeCodeFromList } from '../../../utils';

export const airlinesFilterReducer = (state: string[] = [], action: FilterAirlinesAction): string[] => {
	switch (action.type) {
		case FILTERS_ADD_AIRLINE:
			return addCodeInList(state, action.payload);

		case FILTERS_REMOVE_AIRLINE:
			return removeCodeFromList(state, action.payload);

		case FILTERS_REMOVE_ALL_AIRLINES:
			return [];
	}

	return state;
};
