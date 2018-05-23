import * as React from 'react';
import { RootState } from '../../store/reducers';
import { connect } from 'react-redux';
import { FlightNumberAction, setFlightNumber, toggleFlightNumber } from '../../store/filters/flightNumber/actions';
import { flightNumberIsActive, getFlightNumber } from '../../store/filters/flightNumber/selectors';
import Input from 'material-ui/Input';
import Clear from 'material-ui-icons/Clear';
import Search from 'material-ui-icons/Search';
import Chip from 'material-ui/Chip';
import Filter, { Type as FilterType } from '../Filter';
import { FiltersState } from '../../store/filters/reducers';

const CTRL_KEY_CODE = 17;
const F_KEY_CODE = 70;

interface StateProps {
	getNumberFlight: string;
	flightNumberIsActive: boolean;
}

interface DispatchProps {
	setFlightNumber: (number: string) => FlightNumberAction;
	toggleFlightNumber: () => FlightNumberAction;
}

type Props = StateProps & DispatchProps;

class FlightNumber extends Filter<Props, FiltersState> {
	protected type = FilterType.FlightNumber;
	protected label = 'Поиск';
	private ctrlIsDown: boolean = false;

	constructor(props: Props) {
		super(props);

		this.onText = this.onText.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.componentWillMount = this.componentWillMount.bind(this);
		this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
	}

	componentWillMount(): void {
		window.addEventListener('keydown', this.handleKeyDown);
		window.addEventListener('keyup', this.handleKeyUp);
	}

	componentWillUnmount(): void {
		window.removeEventListener('keydown', this.handleKeyDown);
		window.removeEventListener('keyup', this.handleKeyUp);
	}

	componentWillReceiveProps({flightNumberIsActive}: Props): void {
		this.setState({
			isActive: flightNumberIsActive
		});
	}

	handleKeyDown(event: KeyboardEvent): void {
		if (event.keyCode === CTRL_KEY_CODE || event.metaKey) {
			this.ctrlIsDown = true;
		}

		if (this.ctrlIsDown && event.keyCode === F_KEY_CODE) {
			event.preventDefault();

			this.onClick();
		}
	}

	handleKeyUp(event: KeyboardEvent): void {
		if (event.keyCode === CTRL_KEY_CODE || event.metaKey) {
			this.ctrlIsDown = false;
		}
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

		if (this.props.flightNumberIsActive) {
			this.props.toggleFlightNumber();
		}
	}

	onText(element: React.ChangeEvent<HTMLInputElement>): void {
		this.props.setFlightNumber(element.currentTarget.value);
	}

	clearButton(): React.ReactNode {
		return <div className="results-flightNumberSearch__clear" onClick={this.onClick}>
			<Clear/>
		</div>;
	}

	renderLabel(): React.ReactNode {
		return <div className="results-flightNumberSearch__label">
			<Search/>
			<span>Поиск</span>
		</div>;
	}

	render(): React.ReactNode {
		const state = this.state.isActive;

		return <div className="filters-filter">
			<Chip
				className="filters-filter-chip"
				label={this.renderLabel()}
				onClick={this.onClick}
			/>
			{state ? <div className="results-flightNumberSearch">
				<Input
					type="text"
					onChange={this.onText}
					fullWidth={true}
					autoFocus={true}
					placeholder={'Поиск по названию авиакомпании, номеру рейса, аэропортам отправления и прибытия'}
					endAdornment={this.clearButton()}
				/>
			</div> : null}
		</div>;
	}
}

const mapsToProps = (state: RootState): StateProps => {
	return {
		getNumberFlight: getFlightNumber(state),
		flightNumberIsActive: flightNumberIsActive(state)
	};
};

const mapDispatchToProps = {
	setFlightNumber,
	toggleFlightNumber
};

export default connect(mapsToProps, mapDispatchToProps)(FlightNumber);
