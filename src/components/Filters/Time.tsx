import * as React from 'react';
import { Type as FilterType } from '../Filter';
import WithPopover from './WithPopover';

class Time extends WithPopover<any, any> {
	protected type = FilterType.Time;
	protected label = 'Время';

	renderPopover(): React.ReactNode {
		return 'HELLO';
	}

	onClear(): void {

	}
}

export default Time;
