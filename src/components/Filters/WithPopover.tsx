import * as React from 'react';
import Filter from '../Filter';
import Chip from 'material-ui/Chip';
import Popover from 'material-ui/Popover';

export interface State {
	element?: HTMLElement;
	isOpen?: boolean;
}

abstract class WithPopover<P, S> extends Filter<P, State | S> {
	state: State = {
		isOpen: false,
		element: null
	};

	constructor(props: any) {
		super(props);

		this.getElement = this.getElement.bind(this);
		this.openPopover = this.openPopover.bind(this);
		this.closePopover = this.closePopover.bind(this);
	}

	abstract renderPopover(): React.ReactNode;

	onPopoverOpen(): void {}
	onPopoverClose(): void {}

	getElement(node: HTMLDivElement): void {
		this.setState({
			element: node
		} as State);
	}

	onClick(): void {
		this.openPopover();
	}

	openPopover(): void {
		this.setState({
			isOpen: !this.state.isOpen
		} as State);

		this.onPopoverOpen();
	}

	closePopover(): void {
		this.setState({
			isOpen: false
		} as State);

		this.onPopoverClose();
	}

	render(): React.ReactNode {
		return <div className="filters-filter" ref={this.getElement}>
			<Chip label={this.label} onClick={this.onClick}/>

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
				<div className={`filters-filter-popover__wrapper filters-filter-popover__wrapper_${this.type}`}>
					{this.renderPopover()}
				</div>
			</Popover>
		</div>;
	}
}

export default WithPopover;
