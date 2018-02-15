import * as React from 'react';
import { FormLabel, FormControl, FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Airport from '../../../schemas/Airport';
import { FilterAirportsAction } from '../../../store/filters/actions';
import { ListOfSelectedCodes } from '../../../store/selectors';

interface Props {
	selectedAirports: ListOfSelectedCodes;
	airports: Airport[];
	title: string;
	onChange: (event: React.FormEvent<HTMLInputElement>, checked: boolean) => void;
}

class Tab extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.selectedAirports !== nextProps.selectedAirports;
	}

	render(): React.ReactNode {
		return <div className="filters-filter-popover-tabsSelector-content__wrapper">
			<FormControl component="fieldset">
				<FormLabel className="filters-filter-popover-legend" component="legend">{this.props.title}</FormLabel>
				<FormGroup>
					{this.props.airports.map((airport, index) => (
						<FormControlLabel
							key={index}
							control={
								<Checkbox
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

export default Tab;
