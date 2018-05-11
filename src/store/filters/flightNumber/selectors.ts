import { ApplicationState } from '../../../state';

export const getFlightNumber = (state: ApplicationState): string => state.filters.flightNumber;
