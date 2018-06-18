import { Action, Reducer } from 'redux';
import { RootState } from '../reducers';
import { BATCH_ACTIONS, BatchedAction } from './actions';

export const batchActionsReducer = (reducer: Reducer<RootState>): Reducer<RootState> => {
	return (state: RootState, action: BatchedAction|Action): RootState => {
		switch (action.type) {
			case BATCH_ACTIONS:
				return (action as BatchedAction).payload.reduce(reducer, state);

			default:
				return reducer(state, action);
		}
	};
};
