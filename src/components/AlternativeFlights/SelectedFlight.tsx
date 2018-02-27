import * as React from 'react';
import Button from 'material-ui/Button';
import Flight from '../Flight';

class SelectedFlight extends Flight {
	onBuyButtonClick(event: React.MouseEvent<HTMLDivElement>): void {
		event.stopPropagation();
		event.preventDefault();
	}

	renderSummaryButtonsBlock(): React.ReactNode {
		return <div className="flight-summary__right">
			<Button onClick={this.onBuyButtonClick} color="secondary">Изменить рейс</Button>
		</div>;
	}
}

export default SelectedFlight;
