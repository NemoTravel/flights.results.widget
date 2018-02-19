import * as React from 'react';
import { FormLabel, FormControl, FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import { ListOfSelectedCodes } from '../../../store/filters/selectors';
import { FlightTimeType } from '../../../state';

interface Props {
	selectedTime: ListOfSelectedCodes;
	title: string;
	onChange: (event: React.FormEvent<HTMLInputElement>, checked: boolean) => void;
}

class Tab extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.selectedTime !== nextProps.selectedTime;
	}

	render(): React.ReactNode {
		return <div className="filters-filter-popover-tabsSelector-content__wrapper">
			<FormControl component="fieldset">
				<FormLabel className="filters-filter-popover-legend" component="legend">{this.props.title}</FormLabel>
				<FormGroup>
					<FormControlLabel
						control={
							<Checkbox
								onChange={this.props.onChange}
								checked={FlightTimeType.Morning in this.props.selectedTime}
								value={FlightTimeType.Morning}
							/>
						}
						label="Утро (06:00 - 12:00)"
					/>
					<FormControlLabel
						control={
							<Checkbox
								onChange={this.props.onChange}
								checked={FlightTimeType.Noon in this.props.selectedTime}
								value={FlightTimeType.Noon}
							/>
						}
						label="День (12:00 - 18:00)"
					/>
					<FormControlLabel
						control={
							<Checkbox
								onChange={this.props.onChange}
								checked={FlightTimeType.Evening in this.props.selectedTime}
								value={FlightTimeType.Evening}
							/>
						}
						label="Вечер (18:00 - 00:00)"
					/>
					<FormControlLabel
						control={
							<Checkbox
								onChange={this.props.onChange}
								checked={FlightTimeType.Night in this.props.selectedTime}
								value={FlightTimeType.Night}
							/>
						}
						label="Ночь (00:00 - 06:00)"
					/>
				</FormGroup>
			</FormControl>
		</div>;
	}
}

export default Tab;
