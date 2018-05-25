import { RootState } from '../../reducers';

export const getIsUsable = (state: RootState): boolean => state.filters.usable;
