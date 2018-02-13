import * as React from 'react';
import Filter from '../Filter';
import Airport from '../../schemas/Airport';

interface Props {
	departureAirports: Airport[];
	arrivalAirports: Airport[];
}

class Airports extends Filter<Props> {
	protected label = 'Аэропорты';

	renderPopover(): React.ReactNode {
		return 'HELLO';
	}
}

export default Airports;
