import * as React from 'react';
import Filter, { Type as FilterType } from '../Filter';

class DirectOnly extends Filter<any, any> {
	protected type = FilterType.DirectOnly;
	protected label = 'Без пересадок';

	onClick() {
		console.log(1);
	}
}

export default DirectOnly;
