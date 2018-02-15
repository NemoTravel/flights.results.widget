import * as React from 'react';
import Chip, { ChipProps } from 'material-ui/Chip';
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
		this.onClear = this.onClear.bind(this);
	}

	abstract onClick(): void;
	abstract onClear(): void;

	render(): React.ReactNode {
		const chipProps: ChipProps = {
			label: this.label
		};

		if (this.state.isActive) {
			chipProps.onDelete = this.onClear;
		}
		else {
			chipProps.onClick = this.onClick;
		}

		return <div className={classNames('filters-filter', { 'filters-filter_active': this.state.isActive })}>
			<Chip className="filters-filter-chip" {...chipProps}/>
		</div>;
	}
}

export default Filter;
