import * as React from 'react';
import { FormLabel, FormControl, FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';

import Airline from '../../schemas/Airline';
import Filter, { Type as FilterType } from '../Filter';

interface Props {
	airlines: Airline[];
}

class Airlines extends Filter<Props, any> {
	protected type = FilterType.Airlines;
	protected label = 'Авиакомпании';

	renderPopover(): React.ReactNode {
		return <FormControl component="fieldset">
			<FormLabel className="filters-filter-popover-legend" component="legend">{this.label}</FormLabel>
			<FormGroup>
				{this.props.airlines.map((airline, index) => (
					<FormControlLabel
						key={index}
						control={
							<Checkbox
								checked={false}
								value={airline.IATA}
							/>
						}
						label={airline.name}
					/>
				))}
			</FormGroup>
		</FormControl>;
	}
}

export default Airlines;
