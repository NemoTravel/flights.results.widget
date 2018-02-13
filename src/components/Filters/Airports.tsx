import * as React from 'react';
import Filter from '../Filter';

class Airports extends Filter<any> {
	protected label = 'Аэропорты';

	renderPopover(): React.ReactNode {
		return 'HELLO';
	}
}

export default Airports;
