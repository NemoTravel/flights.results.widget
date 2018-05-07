import * as React from 'react';
import FormGroup from 'material-ui/Form/FormGroup';
import FormControl from 'material-ui/Form/FormControl';
import FormLabel from 'material-ui/Form/FormLabel';

import Checkbox from '../Checkbox';
import { ListOfSelectedCodes } from '../../../store/filters/selectors';
import { FlightTimeInterval } from '../../../enums';

interface Props {
	selectedTime: ListOfSelectedCodes;
	title: string;
	onChange: (event: React.FormEvent<HTMLInputElement>, checked: boolean) => void;
}

class Column extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.selectedTime !== nextProps.selectedTime;
	}

	render(): React.ReactNode {
		return <div className="filters-filter-popover-column">
			<FormControl component="fieldset">
				<FormLabel className="filters-filter-popover-legend" component="legend">{this.props.title}</FormLabel>

				<FormGroup>
					<Checkbox
						onChange={this.props.onChange}
						checked={FlightTimeInterval.Morning in this.props.selectedTime}
						value={FlightTimeInterval.Morning}
						label="Утром (06:00 - 12:00)"
					/>

					<Checkbox
						onChange={this.props.onChange}
						checked={FlightTimeInterval.Afternoon in this.props.selectedTime}
						value={FlightTimeInterval.Afternoon}
						label="Днём (12:00 - 18:00)"
					/>

					<Checkbox
						onChange={this.props.onChange}
						checked={FlightTimeInterval.Evening in this.props.selectedTime}
						value={FlightTimeInterval.Evening}
						label="Вечером (18:00 - 00:00)"
					/>

					<Checkbox
						onChange={this.props.onChange}
						checked={FlightTimeInterval.Night in this.props.selectedTime}
						value={FlightTimeInterval.Night}
						label="Ночью (00:00 - 06:00)"
					/>
				</FormGroup>
			</FormControl>
		</div>;
	}
}

export default Column;
