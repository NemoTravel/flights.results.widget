import * as React from 'react';
import { ApplicationState } from '../../state';
import { connect } from 'react-redux';
import { FlightNumberAction, setFlightNumber } from '../../store/filters/flightNumber/actions';
import { getFlightNumber } from '../../store/filters/flightNumber/selectors';
import { Input } from 'material-ui/Input';

const CTRTL_KEY_CODE = 17;
const F_KEY_CODE = 70;

interface State {
	flightNumberSearch: boolean;
}

interface StateProps {
	getNumberFlight: string;
}

interface DispatchProps {
	setFlightNumber: (number: string) => FlightNumberAction;
}

type Props = StateProps & DispatchProps;

class FlightNumber extends React.Component<Props, State> {
	state: State = {
		flightNumberSearch: false
	};

	inputRef: HTMLInputElement;

	constructor(props: Props) {
		super(props);

		this.onText = this.onText.bind(this);
		this.componentWillMount = this.componentWillMount.bind(this);
	}

	componentWillMount(): void {
		let ctrlIsDown = false;

		window.addEventListener('keydown', (event: KeyboardEvent) => {
			if (event.keyCode === CTRTL_KEY_CODE) {
				ctrlIsDown = true;
			}

			if (ctrlIsDown && event.keyCode === F_KEY_CODE) {
				event.preventDefault();

				this.setState({
					flightNumberSearch: !this.state.flightNumberSearch
				});

				this.inputRef.focus();
			}
		});

		window.addEventListener('keyup', (event: KeyboardEvent) => {
			if (event.keyCode === CTRTL_KEY_CODE) {
				ctrlIsDown = false;
			}
		});
	}

	onText(element: React.ChangeEvent<HTMLInputElement>): void {

		this.props.setFlightNumber(element.currentTarget.value);
	}

	render(): React.ReactNode {
		const state = this.state.flightNumberSearch;

		return <div className="results__flightNumberSearch">
			{ state ? <Input type="text" placeholder={'Поиск по номеру рейса'} onChange={this.onText}/> : null }
		</div>;
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
