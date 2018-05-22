import { RootState } from '../../../store/reducers';

export const getFlightNumber = (state: RootState): string => state.filters.flightNumber.search;
export const flightNumberIsActive = (state: RootState): boolean => state.filters.flightNumber.isActive;
