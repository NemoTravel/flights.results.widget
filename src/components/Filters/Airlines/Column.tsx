import * as React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';

import Checkbox from '../Checkbox';
import Airline from '../../../schemas/Airline';
import { ListOfSelectedCodes } from '../../../store/filters/selectors';
import { CheckboxChangeHandler } from '../../../schemas/CheckboxHandler';

interface Props {
	selectedAirlines: ListOfSelectedCodes;
	airlines: Airline[];
	onChange: CheckboxChangeHandler;
}

class Column extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.selectedAirlines !== nextProps.selectedAirlines;
	}

	render(): React.ReactNode {
		return <div className="filters-filter-popover-column">
			<FormControl component="fieldset">
				<FormGroup className="filters-filter-popover-group">
					{this.props.airlines.map((airline, index) => (
						<Checkbox
							key={index}
							label={airline.name}
							onChange={this.props.onChange}
							checked={airline.IATA in this.props.selectedAirlines}
							value={airline.IATA}
						/>
					))}
				</FormGroup>
			</FormControl>
		</div>;
	}
}

export default Column;
