import { RootState } from '../reducers';

export const getIsLoading = (state: RootState): boolean => state.isLoading;
