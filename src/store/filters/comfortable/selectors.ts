import { RootState } from '../../reducers';

export const getIsComfortable = (state: RootState): boolean => state.filters.comfortable;
