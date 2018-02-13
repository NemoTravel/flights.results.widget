import * as React from 'react';
import { FormLabel, FormControl, FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Airport from '../../../schemas/Airport';

interface Props {
	airports: Airport[];
	title: string;
}

class Tab extends React.Component<Props> {
	render(): React.ReactNode {
		return <FormControl component="fieldset">
			<FormLabel className="filters-filter-popover-legend" component="legend">{this.props.title}</FormLabel>
			<FormGroup>
				{this.props.airports.map((airport, index) => (
					<FormControlLabel
						key={index}
						control={
							<Checkbox
								checked={false}
								value={airport.IATA}
							/>
						}
						label={airport.name}
					/>
				))}
			</FormGroup>
		</FormControl>;
	}
}

export default Tab;
