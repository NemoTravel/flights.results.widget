import * as React from 'react';
import Chip from 'material-ui/Chip';

export enum Type {
	Airports = 'airports',
	Airlines = 'airlines',
	Time = 'time',
	DirectOnly = 'directOnly'
}

abstract class Filter<P, S> extends React.Component<P, S> {
	protected abstract label: string;
	protected abstract type: Type;

	constructor(props: P) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	abstract onClick(): void;

	render(): React.ReactNode {
		return <div className="filters-filter">
			<Chip label={this.label} onClick={this.onClick}/>
		</div>;
	}
}

export default Filter;
