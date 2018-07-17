import * as React from 'react';
import { connect } from 'react-redux';

import TimeColumn from './Time/Column';
import { Type as FilterType } from '../Filter';
import WithPopover, { State as FilterState } from './WithPopover';
import { RootState } from '../../store/reducers';
import { ListOfSelectedCodes } from '../../store/filters/selectors';
import { addTimeInterval, removeAllTimeIntervals, removeTimeInterval } from '../../store/filters/time/actions';
import { getAllTimeIntervals } from '../../store/filters/time/selectors';
import { getSelectedArrivalTimeIntervals, getSelectedDepartureTimeIntervals } from '../../store/selectors';
import { FlightTimeInterval, LocationType } from '../../enums';
import { TimeFilterState } from '../../store/filters/time/reducers';
import { i18n } from '../../i18n';

interface OwnProps {
	handleMobileClick?: () => void;
}

interface TimeIntervalsLabels {
	[interval: string]: string;
}

export const timeIntervalsLabels: TimeIntervalsLabels = {
	[FlightTimeInterval.Morning]: i18n('filters-time-interval_morning'),
	[FlightTimeInterval.Afternoon]: i18n('filters-time-interval_day'),
	[FlightTimeInterval.Evening]: i18n('filters-time-interval_evening'),
	[FlightTimeInterval.Night]: i18n('filters-time-interval_night')
};

interface StateProps {
	selectedDepartureTimeIntervals: ListOfSelectedCodes;
	selectedArrivalTimeIntervals: ListOfSelectedCodes;
	allTimeIntervals: TimeFilterState;
}

interface DispatchProps {
	addTimeInterval: typeof addTimeInterval;
	removeTimeInterval: typeof removeTimeInterval;
	removeAllTimeIntervals: typeof removeAllTimeIntervals;
}

type Props = StateProps & DispatchProps & OwnProps;

class Time extends WithPopover<Props, FilterState> {
	protected type = FilterType.Time;
	protected label = i18n('filters-time-title');

	constructor(props: Props) {
		super(props);

		this.onArrivalChange = this.onArrivalChange.bind(this);
		this.onDepartureChange = this.onDepartureChange.bind(this);
	}

	shouldComponentUpdate(nextProps: Props, nextState: FilterState): boolean {
		return this.props.selectedDepartureTimeIntervals !== nextProps.selectedDepartureTimeIntervals ||
			this.props.selectedArrivalTimeIntervals !== nextProps.selectedArrivalTimeIntervals ||
			this.state.isOpen !== nextState.isOpen ||
			this.state.isActive !== nextState.isActive ||
			this.state.chipLabel !== nextState.chipLabel ||
			this.state.isFullScreenOpen !== nextState.isFullScreenOpen;
	}

	componentWillReceiveProps({ selectedDepartureTimeIntervals, selectedArrivalTimeIntervals }: Props): void {
		const hasSelectedDepartureTimeIntervals = !!Object.keys(selectedDepartureTimeIntervals).length;
		const hasSelectedArrivalTimeIntervals = !!Object.keys(selectedArrivalTimeIntervals).length;
		let chipLabel = this.label;

		if (hasSelectedDepartureTimeIntervals) {
			const parts: string[] = [];

			for (const interval in selectedDepartureTimeIntervals) {
				if (selectedDepartureTimeIntervals.hasOwnProperty(interval)) {
					parts.push(timeIntervalsLabels[interval]);
				}
			}

			chipLabel = `${i18n('filters-departureTitle')}: ${parts.join(', ')}`;
		}

		if (hasSelectedArrivalTimeIntervals) {
			const parts: string[] = [];

			for (const interval in selectedArrivalTimeIntervals) {
				if (selectedArrivalTimeIntervals.hasOwnProperty(interval)) {
					parts.push(timeIntervalsLabels[interval]);
				}
			}

			if (hasSelectedDepartureTimeIntervals) {
				chipLabel = `${chipLabel}, ${i18n('filters-arrivalTitle_lowercase')}`;
			}
			else {
				chipLabel = i18n('filters-arrivalTitle');
			}

			chipLabel += `: ${parts.join(', ')}`;
		}

		this.setState({
			isActive: hasSelectedDepartureTimeIntervals || hasSelectedArrivalTimeIntervals,
			chipLabel: chipLabel
		});
	}

	onDepartureChange(event: React.FormEvent<HTMLInputElement>, checked: boolean): void {
		const timeInterval = (event.target as HTMLInputElement).value as FlightTimeInterval;

		if (checked) {
			this.props.addTimeInterval(timeInterval, LocationType.Departure);
		}
		else {
			this.props.removeTimeInterval(timeInterval, LocationType.Departure);
		}
	}

	onArrivalChange(event: React.FormEvent<HTMLInputElement>, checked: boolean): void {
		const timeInterval = (event.target as HTMLInputElement).value as FlightTimeInterval;

		if (checked) {
			this.props.addTimeInterval(timeInterval, LocationType.Arrival);
		}
		else {
			this.props.removeTimeInterval(timeInterval, LocationType.Arrival);
		}
	}

	onClear(): void {
		this.props.removeAllTimeIntervals();
	}

	isVisible(): boolean {
		return this.props.allTimeIntervals[LocationType.Departure].length > 1 || this.props.allTimeIntervals[LocationType.Arrival].length > 1;
	}

	onMobileClick(): void {
		this.props.handleMobileClick();
	}

	renderPopover(): React.ReactNode {
		return <div className="filters-filter-popover__columns">
			{this.props.allTimeIntervals[LocationType.Departure].length > 1 ? <TimeColumn
				selectedTime={this.props.selectedDepartureTimeIntervals}
				onChange={this.onDepartureChange}
				type={LocationType.Departure}
				suggestedTimes={this.props.allTimeIntervals[LocationType.Departure]}
				title={i18n('filters-time-departureCol-title')}
			/> : null}

			{this.props.allTimeIntervals[LocationType.Arrival].length > 1 ? <TimeColumn
				selectedTime={this.props.selectedArrivalTimeIntervals}
				onChange={this.onArrivalChange}
				type={LocationType.Arrival}
				suggestedTimes={this.props.allTimeIntervals[LocationType.Arrival]}
				title={i18n('filters-time-arrivalCol-title')}
			/> : null}
		</div>;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		selectedDepartureTimeIntervals: getSelectedDepartureTimeIntervals(state),
		selectedArrivalTimeIntervals: getSelectedArrivalTimeIntervals(state),
		allTimeIntervals: getAllTimeIntervals(state)
	};
};

const mapDispatchToProps = {
	addTimeInterval,
	removeTimeInterval,
	removeAllTimeIntervals
};

export default connect(mapStateToProps, mapDispatchToProps)(Time);
