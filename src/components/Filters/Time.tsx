import * as React from 'react';
import Filter from '../Filter';

class Time extends Filter {
	protected label = 'Время';

	renderPopover(): React.ReactNode {
		return 'HELLO';
	}
}

export default Time;
