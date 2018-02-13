import * as React from 'react';
import { FormLabel, FormControl, FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';

import Airline from '../../schemas/Airline';
import Filter, { Type as FilterType } from '../Filter';
import { FilterAirlinesAction } from '../../store/filters/actions';
import { SelectedAirlinesList } from '../../store/selectors';

interface Props {
	airlines: Airline[];
	addAirline: (IATA: string) => FilterAirlinesAction;
	removeAirline: (IATA: string) => FilterAirlinesAction;
	selectedAirlines: SelectedAirlinesList;
}

class Airlines extends Filter<Props, any> {
	protected type = FilterType.Airlines;
	protected label = 'Авиакомпании';

	constructor(props: Props) {
		super(props);

		this.onChange = this.onChange.bind(this);
	}

	onChange(event: React.FormEvent<HTMLInputElement>, checked: boolean): void {
		const airlineCode = (event.target as HTMLInputElement).value;

		if (checked) {
			this.props.addAirline(airlineCode);
		}
		else {
			this.props.removeAirline(airlineCode);
		}
	}

	renderPopover(): React.ReactNode {
		return <FormControl component="fieldset">
			<FormLabel className="filters-filter-popover-legend" component="legend">
				{this.label}
			</FormLabel>

			<FormGroup>
				{this.props.airlines.map((airline, index) => (
					<FormControlLabel
						key={index}
						control={
							<Checkbox
								onChange={this.onChange}
								checked={airline.IATA in this.props.selectedAirlines}
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
