import { RootState } from '../../reducers';

export const getIsDirectOnly = (state: RootState): boolean => state.filters.directOnly;
