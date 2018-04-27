import * as React from 'react';
import { FormLabel, FormControl, FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Airport from '../../../schemas/Airport';
import { ListOfSelectedCodes } from '../../../store/filters/selectors';

interface Props {
	selectedAirports: ListOfSelectedCodes;
	airports: Airport[];
	title: string;
	onChange: (event: React.FormEvent<HTMLInputElement>, checked: boolean) => void;
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
						<FormControlLabel
							key={index}
							className="filters-filter-popover-group__label"
							control={
								<Checkbox
									color="primary"
									onChange={this.props.onChange}
									checked={airport.IATA in this.props.selectedAirports}
									value={airport.IATA}
								/>
							}
							label={airport.name}
						/>
					))}
				</FormGroup>
			</FormControl>
		</div>;
	}
}

export default Column;
