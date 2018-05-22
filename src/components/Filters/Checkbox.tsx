import * as React from 'react';
import CheckboxComponent from 'material-ui/Checkbox';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import { CheckboxChangeHandler } from '../../schemas/CheckboxHandler';

interface Props {
	label: string;
	checked: boolean;
	value: string;
	onChange: CheckboxChangeHandler;
}

class Checkbox extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return nextProps.checked !== this.props.checked ||
			nextProps.label !== this.props.label ||
			nextProps.value !== this.props.value;
	}

	render(): React.ReactNode {
		return <FormControlLabel
			className="filters-filter-popover-group__label"
			control={
				<CheckboxComponent
					color="primary"
					onChange={this.props.onChange}
					checked={this.props.checked}
					value={this.props.value}
				/>
			}
			label={this.props.label}
		/>;
	}
}

export default Checkbox;
