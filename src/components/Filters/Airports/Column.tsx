import * as React from 'react';
import FormGroup from 'material-ui/Form/FormGroup';
import FormControl from 'material-ui/Form/FormControl';
import FormLabel from 'material-ui/Form/FormLabel';

import Checkbox from '../Checkbox';
import Airport from '../../../schemas/Airport';
import { ListOfSelectedCodes } from '../../../store/filters/selectors';
import { CheckboxChangeHandler } from '../../../schemas/CheckboxHandler';

interface Props {
	selectedAirports: ListOfSelectedCodes;
	airports: Airport[];
	title: string;
	onChange: CheckboxChangeHandler;
}

class Column extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.selectedAirports !== nextProps.selectedAirports;
	}

	render(): React.ReactNode {
		return <div className="filters-filter-popover-column">
			<FormControl component="fieldset">
				<FormLabel className="filters-filter-popover-legend" component="legend">{this.props.title}</FormLabel>
				<FormGroup className="filters-filter-popover-group">
					{this.props.airports.map((airport, index) => (
						<Checkbox
							key={index}
							label={airport.name}
							onChange={this.props.onChange}
							checked={airport.IATA in this.props.selectedAirports}
							value={airport.IATA}
						/>
					))}
				</FormGroup>
			</FormControl>
		</div>;
	}
}

export default Column;
