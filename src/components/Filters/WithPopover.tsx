import * as React from 'react';
import * as classnames from 'classnames';
import Chip, { ChipProps } from '@material-ui/core/Chip';
import Popover from '@material-ui/core/Popover';
import Filter, { State as FilterState } from '../Filter';

export interface State extends FilterState {
	element?: HTMLElement;
	isOpen?: boolean;
}

abstract class WithPopover<P, S> extends Filter<P, State | S> {
	state: State = {
		chipLabel: '',
		isActive: false,
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
			chipLabel: this.state.chipLabel,
			isActive: this.state.isActive,
			isOpen: this.state.isOpen,
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
		const chipProps: ChipProps = {
			label: this.state.chipLabel,
			onClick: this.onClick
		};

		if (this.state.isActive) {
			chipProps.onDelete = this.onClear;
		}

		return this.isVisible() ? <div className={classnames('filters-filter', { 'filters-filter_active': this.state.isActive || this.state.isOpen })} ref={this.getElement}>
			<Chip className="filters-filter-chip" {...chipProps}/>

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
		</div> : null;
	}
}

export default WithPopover;
