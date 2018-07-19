import * as React from 'react';
import * as classnames from 'classnames';
import Chip, { ChipProps } from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import MediaQuery from 'react-responsive';
import { ScreenMaxSize } from '../enums';
import { i18n } from '../i18n';

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
		this.onMobileClick = this.onMobileClick.bind(this);
	}

	abstract onClick(): void;
	abstract onClear(): void;
	abstract isVisible(): boolean;
	abstract onMobileClick(): void;

	componentDidMount(): void {
		this.setState({
			chipLabel: this.label
		} as State);
	}

	getChipProps(): ChipProps {
		const chipProps: ChipProps = {
			label: i18n(this.state.chipLabel)
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
				<MediaQuery minDeviceWidth={ScreenMaxSize.Tablet}>
					<Chip className="filters-filter-chip" {...this.getChipProps()}/>
				</MediaQuery>

				<MediaQuery maxDeviceWidth={ScreenMaxSize.Tablet}>
					<MenuItem className="filters-filter-menu" onClick={this.onMobileClick}>
						{i18n(this.state.chipLabel + (this.state.isActive ? '_active' : ''))}
					</MenuItem>
				</MediaQuery>
			</div>
		);
	}
}

export default Filter;
