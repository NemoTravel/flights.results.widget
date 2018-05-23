import * as React from 'react';
import { RootState } from '../../store/reducers';
import { connect } from 'react-redux';
import { FlightSearchAction, setFlightSearch, toggleFlightSearch } from '../../store/filters/flightSearch/actions';
import { flightSearchIsActive, getFlightSearch } from '../../store/filters/flightSearch/selectors';
import Input from 'material-ui/Input';
import Clear from 'material-ui-icons/Clear';
import Search from 'material-ui-icons/Search';
import Chip from 'material-ui/Chip';
import Filter, { Type as FilterType } from '../Filter';
import { FiltersState } from '../../store/filters/reducers';
import Avatar, { AvatarProps } from 'material-ui/Avatar';

const CTRL_KEY_CODE = 17;
const F_KEY_CODE = 70;

interface StateProps {
	getFlightSearch: string;
	flightSearchIsActive: boolean;
}

interface DispatchProps {
	setFlightSearch: typeof setFlightSearch;
	toggleFlightSearch: typeof toggleFlightSearch;
}

type Props = StateProps & DispatchProps;

class FlightSearchFilter extends Filter<Props, FiltersState> {
	protected type = FilterType.FlightSearch;
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

	componentWillReceiveProps({flightSearchIsActive}: Props): void {
		this.setState({
			isActive: flightSearchIsActive
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

		this.props.toggleFlightSearch();

		if (isOpened) {
			this.props.setFlightSearch('');
		}
	}

	onClear(): void {
		this.props.setFlightSearch('');

		if (this.props.flightSearchIsActive) {
			this.props.toggleFlightSearch();
		}
	}

	onText(element: React.ChangeEvent<HTMLInputElement>): void {
		this.props.setFlightSearch(element.currentTarget.value);
	}

	clearButton(): React.ReactNode {
		return <div className="results-flightNumberSearch__clear" onClick={this.onClick}>
			<Clear/>
		</div>;
	}

	renderAvatar(): React.ReactElement<AvatarProps> {
		return <Avatar>
			<Search/>
		</Avatar>;
	}

	render(): React.ReactNode {
		const state = this.state.isActive;

		return <div className="filters-filter">
			<Chip
				className="filters-filter-chip"
				avatar={this.renderAvatar()}
				label={'Поиск'}
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
		getFlightSearch: getFlightSearch(state),
		flightSearchIsActive: flightSearchIsActive(state)
	};
};

const mapDispatchToProps = {
	setFlightSearch,
	toggleFlightSearch
};

export default connect(mapsToProps, mapDispatchToProps)(FlightSearchFilter);
