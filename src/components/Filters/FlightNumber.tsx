import * as React from 'react';
import { ApplicationState } from '../../state';
import { connect } from 'react-redux';
import { FlightNumberAction, setFlightNumber } from '../../store/filters/flightNumber/actions';
import { getFlightNumber } from '../../store/filters/flightNumber/selectors';

interface StateProps {
	getNumberFlight: string;
}

interface DispatchProps {
	setFlightNumber: (number: string) => FlightNumberAction;
}

type Props = StateProps & DispatchProps;

class FlightNumber extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.onText = this.onText.bind(this);
	}

	onText(element: React.FormEvent<HTMLInputElement>): void {
		this.props.setFlightNumber(element.currentTarget.value);
	}

	render(): React.ReactNode {
		const { getNumberFlight } = this.props;

		return <input type="text" onChange={this.onText}/>;
	}
}

const mapsToProps = (state: ApplicationState): StateProps => {
	return {
		getNumberFlight: getFlightNumber(state)
	};
};

const mapDispatchToProps = {
	setFlightNumber
};

export default connect(mapsToProps, mapDispatchToProps)(FlightNumber);
