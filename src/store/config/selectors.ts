import { RootState } from '../reducers';
import { Language } from '../../enums';

export const getLocale = (state: RootState): Language => state.config.locale;
export const getNemoURL = (state: RootState): string => state.config.nemoURL;
