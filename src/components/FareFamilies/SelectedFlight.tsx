import * as React from 'react';
import Button from 'material-ui/Button';

import Flight, { Props as FlightProps } from '../Flight';
import { CommonThunkAction } from '../../state';

interface Props extends FlightProps {
	goToLeg: (legId: number) => CommonThunkAction;
}

class SelectedFlight extends Flight<Props> {
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

	renderFilters(): React.ReactNode {
		return null;
	}
}

export default SelectedFlight;
