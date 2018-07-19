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
import { getActiveFiltersList } from '../store/selectors';

interface State {
	filterPopupOpened: boolean;
	sortingPopupOpened: boolean;
}

interface StateProps {
	sotring: SortingState;
	isOneFilterActive: boolean;
}

interface DispatchProps {
	setSorting: typeof setSorting;
}

class MobileFilters extends React.Component<StateProps & DispatchProps, State> {
	state: State = {
		filterPopupOpened: false,
		sortingPopupOpened: false
	};

	anchorFilters: HTMLElement = null;
	anchorSorting: HTMLElement = null;

	renderFilterPopup(): React.ReactNode {
		return <Menu id="filter-menu" open={this.state.filterPopupOpened} anchorEl={this.anchorFilters} onClose={() => { this.setState({ filterPopupOpened: false }); }}>
			<ComfortableFilter handleMobileClick={this.handlePopupClose}/>
			<DirectOnlyFilter handleMobileClick={this.handlePopupClose}/>
			<AirlineFilter handleMobileClick={this.handlePopupClose}/>
			<AirportsFilter handleMobileClick={this.handlePopupClose}/>
			<TimeFilter handleMobileClick={this.handlePopupClose}/>
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

	@autobind
	handlePopupClose(): void {
		this.setState({
			filterPopupOpened: false
		});
	}

	renderSortingPopup(): React.ReactNode {
		return <Menu id="sorting-menu" open={this.state.sortingPopupOpened} anchorEl={this.anchorSorting} onClose={() => { this.setState({ sortingPopupOpened: false }); }}>
			{this.renderSortigItems()}
		</Menu>;
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

	render(): React.ReactNode {
		const filterClass = 'results-mobileFilters__filters' + (this.props.isOneFilterActive ? ' results-mobileFilters__filters_active' : '');

		return <div className="results-mobileFilters">
			<div onClick={this.handleFilterPopup} className={filterClass} ref={ref => this.anchorFilters = ref} aria-owns={'filter-menu'}>{i18n('filters-title')}<Tune/></div>
			<div onClick={this.handleSortingPopup} className="results-mobileFilters__sorting" ref={ref => this.anchorSorting = ref} aria-owns={'sorting-menu'}>{i18n('sorting-title')}<SwapVert/></div>

			{this.renderFilterPopup()}
			{this.renderSortingPopup()}
		</div>;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		sotring: state.sorting,
		isOneFilterActive: getActiveFiltersList(state)
	};
};

export default connect(mapStateToProps, { setSorting })(MobileFilters);
