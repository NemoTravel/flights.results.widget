import * as React from 'react';
import Chip from 'material-ui/Chip';
import Popover from 'material-ui/Popover';

export interface State {
	element?: HTMLElement;
	isOpen?: boolean;
}

export enum Type {
	Airports = 'airports',
	Airlines = 'airlines',
	Time = 'time'
}

abstract class Filter<P, S> extends React.Component<P, State | S> {
	state: State = {
		isOpen: false,
		element: null
	};

	protected abstract label: string;
	protected abstract type: Type;

	constructor(props: any) {
		super(props);

		this.getElement = this.getElement.bind(this);
		this.openPopover = this.openPopover.bind(this);
		this.closePopover = this.closePopover.bind(this);
	}

	abstract renderPopover(): React.ReactNode;

	getElement(node: HTMLDivElement): void {
		this.setState({
			element: node
		} as State);
	}

	openPopover(): void {
		this.setState({
			isOpen: !this.state.isOpen
		} as State);
	}

	closePopover(): void {
		this.setState({
			isOpen: false
		} as State);
	}

	render(): React.ReactNode {
		return <div className="filters-filter" ref={this.getElement}>
			<Chip label={this.label} onClick={this.openPopover}/>

			<Popover
				className={`filters-filter-popover filters-filter-popover_${this.type}`}
				open={this.state.isOpen}
				onClose={this.closePopover}
				anchorReference="anchorEl"
				anchorEl={this.state.element}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
			>
				<div className={`filters-filter-popover__inner filters-filter-popover__inner_${this.type}`}>
					{this.renderPopover()}
				</div>
			</Popover>
		</div>;
	}
}

export default Filter;
