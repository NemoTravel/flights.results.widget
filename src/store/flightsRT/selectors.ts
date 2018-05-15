import { FlightsRTState } from './reducers';
import { RootState } from '../reducers';

export const getFlightsRT = (state: RootState): FlightsRTState => state.flightsRT;
