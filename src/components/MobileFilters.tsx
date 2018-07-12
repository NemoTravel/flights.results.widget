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

interface State {
	filterPopupOpened: boolean;
	sortingPopupOpened: boolean;
}

interface DispatchProps {
	setSorting: typeof setSorting;
}

class MobileFilters extends React.Component<DispatchProps, State> {
	state: State = {
		filterPopupOpened: false,
		sortingPopupOpened: false
	};

	anchorFilters: HTMLElement = null;
	anchorSorting: HTMLElement = null;

	renderFilterPopup(): React.ReactNode {
		return <Menu id="filter-menu" open={this.state.filterPopupOpened} anchorEl={this.anchorFilters} onClose={() => { this.setState({ filterPopupOpened: false }); }}>
			<DirectOnlyFilter/>
			<AirlineFilter/>
			<AirportsFilter/>
			<MenuItem>Фильтр 2</MenuItem>
		</Menu>;
	}

	renderSortingPopup(): React.ReactNode {
		return <Menu id="sorting-menu" open={this.state.sortingPopupOpened} anchorEl={this.anchorSorting} onClose={() => { this.setState({ sortingPopupOpened: false }); }}>
			<MenuItem onClick={() => this.setSortingHandle(SortingType.DepartureTime)}>По времени вылета</MenuItem>
			<MenuItem onClick={() => this.setSortingHandle(SortingType.ArrivalTime)}>По времени прилета</MenuItem>
			<MenuItem onClick={() => this.setSortingHandle(SortingType.FlightTime)}>По времени в пути</MenuItem>
			<MenuItem onClick={() => this.setSortingHandle(SortingType.Price)}>По стоимости</MenuItem>
		</Menu>;
	}

	@autobind
	setSortingHandle(sortType: SortingType): void {
		this.setState({ sortingPopupOpened: false });
		this.props.setSorting(sortType, SortingDirection.ASC);
	}

	@autobind
	handleFilterPopup(): void {
		this.setState({ filterPopupOpened: true });
	}

	@autobind
	handleSortingPopup(): void {
		this.setState({ sortingPopupOpened: true });
	}

	render(): React.ReactNode {
		return <div className="results-mobileFilters">
			<div onClick={this.handleFilterPopup} ref={ref => this.anchorFilters = ref} aria-owns={'filter-menu'}>Фильтры <Tune/></div>
			<div onClick={this.handleSortingPopup} ref={ref => this.anchorSorting = ref} aria-owns={'sorting-menu'}>Сортировка <SwapVert/></div>

			{this.renderFilterPopup()}
			{this.renderSortingPopup()}
		</div>;
	}
}

export default connect(null, { setSorting })(MobileFilters);
