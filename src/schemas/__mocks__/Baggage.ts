import Baggage from '../Baggage';

export const getBaggage = (): Baggage => {
	return {
		array: [],
		measurement: 'pc',
		text: '',
		value: 0
	};
};
