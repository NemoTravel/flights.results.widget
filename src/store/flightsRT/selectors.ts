import { ApplicationState, FlightsRTState } from '../../state';

export const getFlightsRT = (state: ApplicationState): FlightsRTState => state.flightsRT;
