import * as React from 'react';
import Filter, { Type as FilterType } from '../Filter';

class Time extends Filter<any, any> {
	protected type = FilterType.Time;
	protected label = 'Время';

	renderPopover(): React.ReactNode {
		return 'HELLO';
	}
}

export default Time;
