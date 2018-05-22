import * as React from 'react';
import { connect } from 'react-redux';

import TimeColumn from './Time/Column';
import { Type as FilterType } from '../Filter';
import WithPopover, { State as FilterState } from './WithPopover';
import { RootState } from '../../store/reducers';
import { ListOfSelectedCodes } from '../../store/filters/selectors';
import { addTimeInterval, removeAllTimeIntervals, removeTimeInterval } from '../../store/filters/time/actions';
import { getSelectedArrivalTimeIntervals, getSelectedDepartureTimeIntervals } from '../../store/filters/time/selectors';
import { FlightTimeInterval, LocationType } from '../../enums';

interface TimeIntervalsLabels {
	[interval: string]: string;
}

export const timeIntervalsLabels: TimeIntervalsLabels = {
	[FlightTimeInterval.Morning]: 'утром',
	[FlightTimeInterval.Afternoon]: 'днём',
	[FlightTimeInterval.Evening]: 'вечером',
	[FlightTimeInterval.Night]: 'ночью'
};

interface StateProps {
	selectedDepartureTimeIntervals: ListOfSelectedCodes;
	selectedArrivalTimeIntervals: ListOfSelectedCodes;
}

interface DispatchProps {
	addTimeInterval: typeof addTimeInterval;
	removeTimeInterval: typeof removeTimeInterval;
	removeAllTimeIntervals: typeof removeAllTimeIntervals;
}

type Props = StateProps & DispatchProps;

class Time extends WithPopover<Props, FilterState> {
	protected type = FilterType.Time;
	protected label = 'Время';

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
			this.state.chipLabel !== nextState.chipLabel;
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

			chipLabel = 'Вылет: ' + parts.join(', ');
		}

		if (hasSelectedArrivalTimeIntervals) {
			const parts: string[] = [];

			for (const interval in selectedArrivalTimeIntervals) {
				if (selectedArrivalTimeIntervals.hasOwnProperty(interval)) {
					parts.push(timeIntervalsLabels[interval]);
				}
			}

			chipLabel = `${hasSelectedDepartureTimeIntervals ? chipLabel + ', ' : ''}Прилет: ${parts.join(', ')}`;
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
		return true;
	}

	renderPopover(): React.ReactNode {
		return <div className="filters-filter-popover__columns">
			<TimeColumn
				selectedTime={this.props.selectedDepartureTimeIntervals}
				onChange={this.onDepartureChange}
				title="Время вылета"
			/>

			<TimeColumn
				selectedTime={this.props.selectedArrivalTimeIntervals}
				onChange={this.onArrivalChange}
				title="Время прилета"
			/>
		</div>;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		selectedDepartureTimeIntervals: getSelectedDepartureTimeIntervals(state),
		selectedArrivalTimeIntervals: getSelectedArrivalTimeIntervals(state)
	};
};

const mapDispatchToProps = {
	addTimeInterval,
	removeTimeInterval,
	removeAllTimeIntervals
};

export default connect(mapStateToProps, mapDispatchToProps)(Time);
