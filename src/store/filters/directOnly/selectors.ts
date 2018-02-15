import { ApplicationState } from '../../../state';

export const getIsDirectOnly = (state: ApplicationState): boolean => state.filters.directOnly;
