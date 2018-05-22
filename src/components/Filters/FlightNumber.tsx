import * as React from 'react';
import { RootState } from '../../store/reducers';
import { connect } from 'react-redux';
import { FlightNumberAction, setFlightNumber, toggleFlightNumber } from '../../store/filters/flightNumber/actions';
import { getFlightNumber } from '../../store/filters/flightNumber/selectors';
import Input from 'material-ui/Input';
import Clear from 'material-ui-icons/Clear';
import Chip from 'material-ui/Chip';
import Filter, { Type as FilterType } from '../Filter';
import { FiltersState } from '../../store/filters/reducers';

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
	toggleFlightNumber: () => FlightNumberAction;
}

type Props = StateProps & DispatchProps;

class FlightNumber extends Filter<Props, FiltersState> {
	protected type = FilterType.FlightNumber;
	protected label = 'Поиск';

	constructor(props: Props) {
		super(props);

		this.onText = this.onText.bind(this);
		this.componentWillMount = this.componentWillMount.bind(this);
	}

	componentWillMount(): void {
		let ctrlIsDown = false;

		window.addEventListener('keydown', (event: KeyboardEvent) => {
			if (event.keyCode === CTRL_KEY_CODE || event.metaKey) {
				ctrlIsDown = true;
			}

			if (ctrlIsDown && event.keyCode === F_KEY_CODE) {
				event.preventDefault();

				this.onClick();
			}
		});

		window.addEventListener('keyup', (event: KeyboardEvent) => {
			if (event.keyCode === CTRL_KEY_CODE || event.metaKey) {
				ctrlIsDown = false;
			}
		});
	}

	isVisible(): boolean {
		return true;
	}

	onClick(): void {
		const isOpened = this.state.isActive;

		this.setState({
			isActive: !isOpened
		});

		this.props.toggleFlightNumber();

		if (isOpened) {
			this.props.setFlightNumber('');
		}
	}

	onClear(): void {
		this.props.setFlightNumber('');
	}

	onText(element: React.ChangeEvent<HTMLInputElement>): void {
		this.props.setFlightNumber(element.currentTarget.value);
	}

	clearButton(): React.ReactNode {
		return <div className="results-flightNumberSearch__clear" onClick={this.onClick}>
			<Clear/>
		</div>;
	}

	render(): React.ReactNode {
		const state = this.state.isActive;

		return <div className="filters-filter">
			<Chip className="filters-filter-chip" label={'Поиск'} onClick={this.onClick}/>
			{state ? <div className="results-flightNumberSearch">
				<Input
					type="text"
					onChange={this.onText}
					fullWidth={true}
					autoFocus={true}
					placeholder={'Поиск по номеру рейса'}
					endAdornment={this.clearButton()}
				/>
			</div> : null}
		</div>;
	}
}

const mapsToProps = (state: RootState): StateProps => {
	return {
		getNumberFlight: getFlightNumber(state)
	};
};

const mapDispatchToProps = {
	setFlightNumber,
	toggleFlightNumber
};

export default connect(mapsToProps, mapDispatchToProps)(FlightNumber);
