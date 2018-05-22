import * as React from 'react';
import { RootState } from '../../store/reducers';
import { connect } from 'react-redux';
import { FlightNumberAction, setFlightNumber } from '../../store/filters/flightNumber/actions';
import { getFlightNumber } from '../../store/filters/flightNumber/selectors';
import Input from 'material-ui/Input';
import Clear from 'material-ui-icons/Clear';
import Chip from 'material-ui/Chip';

const CTRL_KEY_CODE = 17;
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

	constructor(props: Props) {
		super(props);

		this.onText = this.onText.bind(this);
		this.componentWillMount = this.componentWillMount.bind(this);
		this.toogleFlightSearch = this.toogleFlightSearch.bind(this);
	}

	componentWillMount(): void {
		let ctrlIsDown = false;

		window.addEventListener('keydown', (event: KeyboardEvent) => {
			if (event.keyCode === CTRL_KEY_CODE || event.metaKey) {
				ctrlIsDown = true;
			}

			if (ctrlIsDown && event.keyCode === F_KEY_CODE) {
				event.preventDefault();

				this.toogleFlightSearch();
			}
		});

		window.addEventListener('keyup', (event: KeyboardEvent) => {
			if (event.keyCode === CTRL_KEY_CODE || event.metaKey) {
				ctrlIsDown = false;
			}
		});
	}

	toogleFlightSearch(): void {
		const isOpened = this.state.flightNumberSearch;

		this.setState({
			flightNumberSearch: !isOpened
		});

		if (isOpened) {
			this.props.setFlightNumber('');
		}
	}

	onText(element: React.ChangeEvent<HTMLInputElement>): void {
		this.props.setFlightNumber(element.currentTarget.value);
	}

	clearButton(): React.ReactNode {
		return <div className="results-flightNumberSearch__clear" onClick={this.toogleFlightSearch}>
			<Clear/>
		</div>;
	}

	render(): React.ReactNode {
		const state = this.state.flightNumberSearch;

		return <div className="results-flightNumberSearch">
			<Chip className="filters-filter-chip" label={'Поиск'} onClick={this.toogleFlightSearch}/>
			{state ? <Input
						type="text"
						onChange={this.onText}
						fullWidth={true}
						autoFocus={true}
						placeholder={'Поиск по номеру рейса'}
						endAdornment={this.clearButton()}
					/> : null}
			</div>;
	}
}

const mapsToProps = (state: RootState): StateProps => {
	return {
		getNumberFlight: getFlightNumber(state)
	};
};

const mapDispatchToProps = {
	setFlightNumber
};

export default connect(mapsToProps, mapDispatchToProps)(FlightNumber);
