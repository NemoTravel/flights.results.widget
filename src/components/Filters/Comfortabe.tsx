import * as React from 'react';
import * as classnames from 'classnames';
import Chip, { ChipProps } from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';

import Filter, { Type as FilterType, State as FilterState } from '../Filter';
import { RootState } from '../../store/reducers';
import { toggleComfortable } from '../../store/filters/comfortable/actions';
import { getIsComfortable } from '../../store/filters/comfortable/selectors';
import { isFirstLeg } from '../../store/currentLeg/selectors';
import { getAllAirlines, getFilteredAirlines } from '../../store/filters/airlines/selectors';
import { getAirlinesIATA, getSelectedFlights } from '../../store/selectedFlights/selectors';
import Flight from '../../models/Flight';
import Airline from '../../schemas/Airline';
import Airport from '../../schemas/Airport';
import { getDepartureAirports, getFilteredDepartureAirports } from '../../store/filters/airports/selectors';

interface StateProps {
	isActive: boolean;
	isFirstLeg: boolean;
	allAirlinesInLeg: Airline[];
	selectedAirlines: string[];
	selectedFlights: Flight[];
	departureAirports: Airport[];
	selectedDepartureAirports: string[];
}

interface DispatchProps {
	toggleComfortable: typeof toggleComfortable;
}

type Props = StateProps & DispatchProps;

class Comfortable extends Filter<Props, FilterState> {
	protected type = FilterType.Comfortable;
	protected label = 'Удобные рейсы';

	shouldComponentUpdate(nextProps: Props, nextState: FilterState): boolean {
		return this.props.isActive !== nextProps.isActive ||
			this.props.isFirstLeg !== nextProps.isFirstLeg ||
			this.props.allAirlinesInLeg !== nextProps.allAirlinesInLeg ||
			this.props.selectedAirlines !== nextProps.selectedAirlines ||
			this.props.selectedFlights !== nextProps.selectedFlights ||
			this.state.isActive !== nextState.isActive ||
			this.state.chipLabel !== nextState.chipLabel;
	}

	componentWillReceiveProps(props: Props): void {
		this.setState({
			isActive: props.isActive
		} as FilterState);
	}

	onClick(): void {
		this.props.toggleComfortable();
	}

	isVisible(): boolean {
		if (this.props.isFirstLeg) {
			return;
		}

		return this.isAirlineExist() && this.isAirportExist();
	}

	isAirlineExist(): boolean {
		const airlinesIATA = getAirlinesIATA(this.props.selectedFlights);

		if (this.props.selectedAirlines.length) {
			return !!this.props.selectedAirlines.find(airline => {
				return airlinesIATA.hasOwnProperty(airline);
			});
		}
		else {
			return !!this.props.allAirlinesInLeg.find(airline => {
				return airlinesIATA.hasOwnProperty(airline.IATA);
			});
		}
	}

	isAirportExist(): boolean {
		const prevLegArrival = this.props.selectedFlights[this.props.selectedFlights.length - 1].lastSegment.arrAirport.IATA;

		if (this.props.selectedDepartureAirports.length) {
			return this.props.selectedDepartureAirports.indexOf(prevLegArrival) >= 0;
		}
		else {
			return !!this.props.departureAirports.find(airline => {
				return airline.IATA === prevLegArrival;
			});
		}
	}

	onClear(): void {
		this.props.toggleComfortable();
	}

	render(): React.ReactNode {
		return this.isVisible() ? (
			<div className={classnames('filters-filter', { 'filters-filter_active': this.state.isActive })}>
				<Tooltip title="Рейсы той же авиакомпании с вылетом из того же аэропорта" placement="top">
					<Chip className="filters-filter-chip" {...this.getChipProps()}/>
				</Tooltip>
			</div>
		) : null;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		isActive: getIsComfortable(state),
		isFirstLeg: isFirstLeg(state),
		allAirlinesInLeg: getAllAirlines(state),
		selectedAirlines: getFilteredAirlines(state),
		selectedFlights: getSelectedFlights(state),
		departureAirports: getDepartureAirports(state),
		selectedDepartureAirports: getFilteredDepartureAirports(state)
	};
};

const mapDispatchToProps = {
	toggleComfortable
};

export default connect(mapStateToProps, mapDispatchToProps)(Comfortable);
