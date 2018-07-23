import * as React from 'react';
import * as classnames from 'classnames';
import { connect } from 'react-redux';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import Avatar, { AvatarProps } from '@material-ui/core/Avatar';
import Clear from '@material-ui/icons/Clear';
import Search from '@material-ui/icons/Search';

import { setFlightSearch, toggleFlightSearch } from '../../store/filters/flightSearch/actions';
import { flightSearchIsActive, getFlightSearch } from '../../store/filters/flightSearch/selectors';
import { RootState } from '../../store/reducers';
import Filter, { Type as FilterType } from '../Filter';
import { FiltersState } from '../../store/filters/reducers';
import { i18n } from '../../i18n';
import MediaQuery from 'react-responsive';
import { ScreenMaxSize } from '../../enums';
import MenuItem from '@material-ui/core/MenuItem';

const CTRL_KEY_CODE = 'Control';
const META_KEY_CODE = 'Meta';
const ESC_KEY_CODE = 'Escape';
const F_KEY_CODE = 'f';

interface OwnProps {
	handleMobileClick?: () => void;
}

interface StateProps {
	getFlightSearch: string;
	flightSearchIsActive: boolean;
}

interface DispatchProps {
	setFlightSearch: typeof setFlightSearch;
	toggleFlightSearch: typeof toggleFlightSearch;
}

type Props = StateProps & DispatchProps & OwnProps;

class FlightSearch extends Filter<Props, FiltersState> {
	protected type = FilterType.FlightSearch;
	protected label = i18n('filters-search-title');
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
		if (event.key === CTRL_KEY_CODE || event.key === META_KEY_CODE) {
			this.ctrlIsDown = true;
		}

		if (this.ctrlIsDown && event.key === F_KEY_CODE || event.key === ESC_KEY_CODE && this.props.flightSearchIsActive) {
			event.preventDefault();

			this.onClick();
		}
	}

	handleKeyUp(event: KeyboardEvent): void {
		if (event.key === CTRL_KEY_CODE || event.key === META_KEY_CODE) {
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

	onMobileClick(): void {
		this.onClick();
		this.props.handleMobileClick();
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
		return <Avatar className="filters-filter-chip__icon">
			<Search className="results-flightNumberSearch__lensIcon"/>
		</Avatar>;
	}

	render(): React.ReactNode {
		const isActive = this.state.isActive;

		return <>
			<MediaQuery minDeviceWidth={ScreenMaxSize.Tablet}>
				<div className={classnames('filters-filter', { 'filters-filter_active': isActive })}>
					<Chip
						className="filters-filter-chip"
						avatar={this.renderAvatar()}
						label={this.label}
						onClick={this.onClick}
					/>

					{isActive ? <div className="results-flightNumberSearch">
						<Input
							type="text"
							onChange={this.onText}
							fullWidth={true}
							autoFocus={true}
							placeholder={i18n('filters-search-placeholder')}
							endAdornment={this.clearButton()}
						/>
					</div> : null}
				</div>
			</MediaQuery>

			<MediaQuery maxDeviceWidth={ScreenMaxSize.Tablet}>
				<MenuItem className={classnames('filters-filter-menu', { 'filters-filter-menu_active': isActive })} onClick={this.onMobileClick}>{this.state.chipLabel}</MenuItem>
			</MediaQuery>
		</>;
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

export default connect(mapsToProps, mapDispatchToProps)(FlightSearch);
