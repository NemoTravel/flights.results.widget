import * as React from 'react';
import Button from '@material-ui/core/Button';
import StarIcon from '@material-ui/icons/Stars';

import Flight, { Props as FlightProps } from '../Flight';
import { goToLeg } from '../../store/currentLeg/actions';
import * as classnames from 'classnames';
import Price from '../Price';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';

const tariffTooltipText = 'Мы нашли дешевый сквозной тариф на данное направление. Заказ будет оформлен одним билетом на весь маршрут.';

interface Props extends FlightProps {
	goToLeg: typeof goToLeg;
}

class SelectedFlight extends Flight<Props> {
	protected isDirect = false;

	constructor(props: Props) {
		super(props);

		if (this.props.flight.segments.length === 1) {
			this.isDirect = true;
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

			<Button onClick={this.onBuyButtonClick} color="secondary">Изменить</Button>
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
