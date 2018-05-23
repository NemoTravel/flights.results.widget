import { RootState } from '../../../store/reducers';

export const getFlightSearch = (state: RootState): string => state.filters.flightSearch.search;
export const flightSearchIsActive = (state: RootState): boolean => state.filters.flightSearch.isActive;
