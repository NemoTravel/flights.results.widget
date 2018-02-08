import * as React from 'react';
import Filter from '../Filter';

class Airlines extends Filter {
	protected label = 'Авиакомпания';

	renderPopover(): React.ReactNode {
		return 'HELLO';
	}
}

export default Airlines;
