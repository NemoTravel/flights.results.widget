import { RootState } from '../../../store/reducers';

export const getFlightNumber = (state: RootState): string => state.filters.flightNumber;
