import * as React from 'react';
import * as classnames from 'classnames';
import Button from '@material-ui/core/Button';
import autobind from 'autobind-decorator';

import Flight from './Flight';
import SelectedFlightSchema from '../schemas/SelectedFlight';
import { goToLeg } from '../store/currentLeg/actions';
import Price from './Price';
import FlightModel from '../models/Flight';

interface Props {
	flight: FlightModel;
	goToLeg: typeof goToLeg;
	showPricePrefix: boolean;
	replacement: SelectedFlightSchema;
	currentLegId: number;
}

class SelectedFlight extends React.Component<Props> {
	@autobind
	onAction(event: React.MouseEvent<HTMLDivElement>): void {
		event.stopPropagation();
		event.preventDefault();

		this.props.goToLeg(this.props.currentLegId);
	}

	@autobind
	renderActionBlock(): React.ReactNode {
		const { flight, replacement, currentLegId, showPricePrefix } = this.props;
		const price = replacement ? replacement.price : flight.totalPrice;

		return <div className="flight-summary__right">
			<div className="flight-summary-price">
				<div className={classnames('flight-summary-price__amount', { 'flight-summary-price__amount_profitable': price.amount < 0 })}>
					{showPricePrefix ? <span className="flight-summary-price__amount-prefix">от</span> : null}

					<Price withPlus={currentLegId !== 0} price={price}/>
				</div>

				{currentLegId === 0 ? (
					<div className="flight-summary-price__route">
						за весь маршрут
					</div>
				) : null}
			</div>

			<Button className="flight-summary-changeFlight" onClick={this.onAction} color="secondary">Изменить</Button>
		</div>;
	}

	render(): React.ReactNode {
		const isDirect = this.props.flight.segments.length === 1;

		return (
			<Flight
				{...this.props}
				className={classnames('flight', { flight_direct: isDirect })}
				isToggleable={!isDirect}
				showOpenedSummary={isDirect}
				renderActionBlock={this.renderActionBlock}
			/>
		);
	}
}

export default SelectedFlight;
