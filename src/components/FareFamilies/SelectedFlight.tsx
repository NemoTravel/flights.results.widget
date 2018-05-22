import * as React from 'react';
import Button from '@material-ui/core/Button';

import Flight, { Props as FlightProps } from '../Flight';
import { goToLeg } from '../../store/currentLeg/actions';

interface Props extends FlightProps {
	goToLeg: typeof goToLeg;
}

class SelectedFlight extends Flight<Props> {
	protected isDirect = false;

	constructor(props: Props) {
		super(props);

		this.isDirect = this.props.flight.segments.length === 1;

		if (this.isDirect) {
			this.mainClassName += ' flight_direct';
		}
	}

	toggleDetails(): void {
		if (!this.isDirect) {
			super.toggleDetails();
		}
	}

	onBuyButtonClick(event: React.MouseEvent<HTMLDivElement>): void {
		event.stopPropagation();
		event.preventDefault();
		this.props.goToLeg(this.props.currentLegId);
	}

	renderSummaryButtonsBlock(): React.ReactNode {
		return <div className="flight-summary__right">
			<Button onClick={this.onBuyButtonClick} color="secondary">Изменить рейс</Button>
		</div>;
	}

	renderSummaryMiddleClosed(): React.ReactNode {
		return this.isDirect ? this.renderSummaryMiddleOpened() : super.renderSummaryMiddleClosed();
	}

	renderFilters(): React.ReactNode {
		return null;
	}
}

export default SelectedFlight;
