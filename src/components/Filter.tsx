import * as React from 'react';
import Chip, { ChipProps } from 'material-ui/Chip';
import classNames = require('classnames');
import Airline from '../schemas/Airline';

export enum Type {
	Airports = 'airports',
	Airlines = 'airlines',
	Time = 'time',
	DirectOnly = 'directOnly',
	FlightNumber = 'flightNumber'
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

	render(): React.ReactNode {
		const chipProps: ChipProps = {
			label: this.state.chipLabel
		};

		if (this.state.isActive) {
			chipProps.onDelete = this.onClear;
		}
		else {
			chipProps.onClick = this.onClick;
		}

		return this.isVisible() ? <div className={classNames('filters-filter', { 'filters-filter_active': this.state.isActive })}>
			<Chip className="filters-filter-chip" {...chipProps}/>
		</div> : null;
	}
}

export default Filter;
