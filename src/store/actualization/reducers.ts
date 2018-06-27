import { combineReducers } from 'redux';
import AvailabilityInfo from '../../schemas/AvailabilityInfo';
import { infoReducer as info } from './info/reducers';
import { problemReducer as problem } from './problem/reducers';

export enum ActualizationProblem {
	Price,
	Availability,
	Unknown
}

export interface ActualizationState {
	info: AvailabilityInfo[];
	problem: ActualizationProblem;
}

export const actualizationReducer = combineReducers<ActualizationState>({
	info,
	problem
});
