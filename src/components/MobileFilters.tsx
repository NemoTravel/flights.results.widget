import * as React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import autobind from 'autobind-decorator';
import { setSorting } from '../store/sorting/actions';
import { connect } from 'react-redux';
import { SortingDirection, SortingType } from '../enums';
import SwapVert from '@material-ui/icons/SwapVert';
import Tune from '@material-ui/icons/Tune';
import DirectOnlyFilter from './Filters/DirectOnly';
import AirlineFilter from './Filters/Airlines';
import AirportsFilter from './Filters/Airports';
import TimeFilter from './Filters/Time';
import ComfortableFilter from './Filters/Comfortabe';
import { i18n } from '../i18n';
import { SortingState } from '../store/sorting/reducers';
import { RootState } from '../store/reducers';
import SortingItem from './SortingItem';
import { isOneFilterActive } from '../store/selectors';
import Button from '@material-ui/core/Button';
import { removeAllFilters } from '../store/filters/actions';
import FlightSearch from './Filters/FlightSearch';
import AppBar from '@material-ui/core/AppBar';
import Input from '@material-ui/core/Input';
import { flightSearchIsActive } from '../store/filters/flightSearch/selectors';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { setFlightSearch, toggleFlightSearch } from '../store/filters/flightSearch/actions';

interface State {
	filterPopupOpened: boolean;
	sortingPopupOpened: boolean;
}

interface StateProps {
	sotring: SortingState;
	isOneFilterActive: boolean;
	flightSearchIsActive: boolean;
}

interface DispatchProps {
	setSorting: typeof setSorting;
	removeAllFilters: typeof removeAllFilters;
	toggleFlightSearch: typeof toggleFlightSearch;
	setFlightSearch: typeof setFlightSearch;
}

class MobileFilters extends React.Component<StateProps & DispatchProps, State> {
	state: State = {
		filterPopupOpened: false,
		sortingPopupOpened: false
	};

	searchInputRef: HTMLElement = null;
	anchorFilters: HTMLElement = null;
	anchorSorting: HTMLElement = null;

	@autobind
	handlePopupClose(): void {
		this.setState({
			filterPopupOpened: false
		});
	}

	@autobind
	setSortingHandle(sortType: SortingType): void {
		this.setState({ sortingPopupOpened: false });
		this.props.setSorting(sortType, this.props.sotring.direction === SortingDirection.ASC ? SortingDirection.DESC : SortingDirection.ASC);
	}

	@autobind
	handleFilterPopup(): void {
		this.setState({ filterPopupOpened: true });
	}

	@autobind
	handleSortingPopup(): void {
		this.setState({ sortingPopupOpened: true });
	}

	@autobind
	onSearchText(element: React.KeyboardEvent<HTMLInputElement>): void {
		this.props.setFlightSearch(element.currentTarget.value);
	}

	@autobind
	closeFlightSearch(): void {
		this.props.toggleFlightSearch();
		this.props.setFlightSearch('');
	}

	componentWillReceiveProps({ flightSearchIsActive }: StateProps): void {
		// Material UI don't want to set focus via autoFocus={true} in this case
		if (flightSearchIsActive) {
			setTimeout(() => {
				this.searchInputRef.focus();
			}, 500);
		}
	}

	renderFlightSearch(): React.ReactNode {
		return <>
			<AppBar className="results-mobileFilters-flightSearch">
				<Toolbar>
					<IconButton color="inherit" onClick={this.closeFlightSearch} aria-label="Close">
						<CloseIcon/>
					</IconButton>

					<Input
						type="text"
						fullWidth={true}
						autoFocus={true}
						placeholder={i18n('filters-search-placeholder')}
						onKeyDown={this.onSearchText}
						className="results-mobileFilters-flightSearch__textField"
						inputRef={ref => this.searchInputRef = ref}
					/>
				</Toolbar>
			</AppBar>
		</>;
	}

	renderSortingPopup(): React.ReactNode {
		return <Menu id="sorting-menu" open={this.state.sortingPopupOpened} anchorEl={this.anchorSorting} onClose={() => { this.setState({ sortingPopupOpened: false }); }}>
			{this.renderSortigItems()}
		</Menu>;
	}

	renderFilterPopup(): React.ReactNode {
		return <Menu id="filter-menu" open={this.state.filterPopupOpened} anchorEl={this.anchorFilters} onClose={() => { this.setState({ filterPopupOpened: false }); }}>
			<ComfortableFilter handleMobileClick={this.handlePopupClose}/>
			<DirectOnlyFilter handleMobileClick={this.handlePopupClose}/>
			<AirlineFilter handleMobileClick={this.handlePopupClose}/>
			<AirportsFilter handleMobileClick={this.handlePopupClose}/>
			<TimeFilter handleMobileClick={this.handlePopupClose}/>
			<FlightSearch handleMobileClick={this.handlePopupClose}/>
		</Menu>;
	}

	renderSortigItems(): React.ReactNode {
		const same: React.ReactNode[] = [];

		for (const item in SortingType) {
			same.push(<MenuItem onClick={() => this.setSortingHandle(item as SortingType)} key={item}>
				<SortingItem
					type={item as SortingType}
					setSorting={this.props.setSorting}
					isActive={this.props.sotring.type === (item as SortingType)}
					direction={this.props.sotring.direction}
				/>
			</MenuItem>);
		}

		return same;
	}

	render(): React.ReactNode {
		const filterContainerClass = 'results-mobileFilters__filters' + (this.props.isOneFilterActive ? ' results-mobileFilters__filters_active' : ''),
			sortingContainerClass = 'results-mobileFilters__sorting';

		return <div className="results-mobileFilters">
			<div className="results-mobileFilters__container">
				<div onClick={this.handleFilterPopup} className={filterContainerClass} ref={ref => this.anchorFilters = ref} aria-owns={'filter-menu'}>{i18n('filters-title')}<Tune/></div>
				<div onClick={this.handleSortingPopup} className={sortingContainerClass} ref={ref => this.anchorSorting = ref} aria-owns={'sorting-menu'}>{i18n('sorting-title')}<SwapVert/></div>
			</div>

			{this.props.isOneFilterActive && <div className="results-mobileFilters-reset">
				<Button variant="outlined" color="primary" className="results-mobileFilters-reset__button" onClick={this.props.removeAllFilters}>
					{i18n('filters-removeAll')}
				</Button>
			</div>}

			{this.renderFilterPopup()}
			{this.renderSortingPopup()}
			{this.props.flightSearchIsActive ? this.renderFlightSearch() : null}
		</div>;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		sotring: state.sorting,
		isOneFilterActive: isOneFilterActive(state),
		flightSearchIsActive: flightSearchIsActive(state)
	};
};

const mapDispatchToProps = {
	setSorting,
	removeAllFilters,
	toggleFlightSearch,
	setFlightSearch
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileFilters);
