import * as React from 'react';
import Chip from 'material-ui/Chip';
import classNames = require('classnames');

export enum Type {
	Airports = 'airports',
	Airlines = 'airlines',
	Time = 'time',
	DirectOnly = 'directOnly'
}

export interface State {
	isActive: boolean;
}

abstract class Filter<P, S> extends React.Component<P, S | State> {
	state: State = {
		isActive: false
	};

	protected abstract label: string;
	protected abstract type: Type;

	constructor(props: P) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	abstract onClick(): void;

	render(): React.ReactNode {
		return <div className={classNames('filters-filter', { 'filters-filter_active': this.state.isActive })}>
			<Chip className="filters-filter-chip" label={this.label} onClick={this.onClick}/>
		</div>;
	}
}

export default Filter;
