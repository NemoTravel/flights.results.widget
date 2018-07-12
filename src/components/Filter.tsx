import * as React from 'react';
import * as classnames from 'classnames';
import Chip, { ChipProps } from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';

export enum Type {
	Airports = 'airports',
	Airlines = 'airlines',
	Time = 'time',
	DirectOnly = 'directOnly',
	FlightSearch = 'flightSearch',
	Comfortable = 'comfortable'
}

export interface State {
	isActive: boolean;
	chipLabel: string;
}

abstract class Filter<P, S> extends React.Component<P, S | State> {
	state: State = {
		chipLabel: '',
		isActive: false
	};

	protected abstract label: string;
	protected abstract type: Type;

	constructor(props: P) {
		super(props);

		this.onClick = this.onClick.bind(this);
		this.onClear = this.onClear.bind(this);
	}

	abstract onClick(): void;
	abstract onClear(): void;
	abstract isVisible(): boolean;

	componentDidMount(): void {
		this.setState({
			chipLabel: this.label
		} as State);
	}

	getChipProps(): ChipProps {
		const chipProps: ChipProps = {
			label: this.state.chipLabel
		};

		if (this.state.isActive) {
			chipProps.onDelete = this.onClear;
		}
		else {
			chipProps.onClick = this.onClick;
		}

		return chipProps;
	}

	render(): React.ReactNode {
		return this.isVisible() && (
			<div className={classnames('filters-filter', { 'filters-filter_active': this.state.isActive })}>
				<Chip className="filters-filter-chip" {...this.getChipProps()}/>
				<MenuItem className="filters-filter-menu" onClick={this.onClick}>{this.state.chipLabel}</MenuItem>
			</div>
		);
	}
}

export default Filter;
