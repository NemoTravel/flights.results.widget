import * as React from 'react';
import * as classnames from 'classnames';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import StarIcon from '@material-ui/icons/Stars';
import autobind from 'autobind-decorator';

import Price from './Price';
import Flight from './Flight';
import Button from './Flight/Button';
import { selectFlight } from '../store/selectedFlights/actions';
import SelectedFlight from '../schemas/SelectedFlight';
import FlightModel from '../models/Flight';
import Money from '../schemas/Money';

const tariffTooltipText = 'Мы нашли дешевый сквозной тариф на данное направление. Заказ будет оформлен одним билетом на весь маршрут.';

interface Props {
	flight: FlightModel;
	selectFlight: typeof selectFlight;
	showPricePrefix: boolean;
	replacement: SelectedFlight;
	totalPrice: Money;
	currentLegId: number;
}

class ResultsFlight extends React.Component<Props> {
	@autobind
	onAction(event: React.MouseEvent<HTMLDivElement>): void {
		event.stopPropagation();
		event.preventDefault();

		this.props.selectFlight(this.props.replacement, this.props.currentLegId);
	}

	@autobind
	renderActionBlock(): React.ReactNode {
		const { flight, replacement, totalPrice, currentLegId, showPricePrefix } = this.props;
		const price = replacement ? replacement.price : flight.totalPrice;
		let buttonText = <span>Выбрать</span>;

		if (totalPrice) {
			buttonText = <Price price={totalPrice}/>;
		}

		return <div className="flight-summary__right">
			<div className="flight-summary-price">
				<div className={classnames('flight-summary-price__amount', { 'flight-summary-price__amount_profitable': price.amount < 0 })}>
					{showPricePrefix ? <span className="flight-summary-price__amount-prefix">от</span> : null}

					<Price withPlus={currentLegId !== 0} price={price}/>
				</div>

				{price.amount < 0 ? (
					<Tooltip title={tariffTooltipText} placement="top">
						<div className="flight-summary-price-profitMark">
							<div className="flight-summary-price-profitMark__icon">
								<StarIcon/>
							</div>

							<span className="flight-summary-price-profitMark__text">выгодный тариф</span>
						</div>
					</Tooltip>
				) : null}

				{currentLegId === 0 ? (
					<div className="flight-summary-price__route">
						за весь маршрут
					</div>
				) : null}
			</div>

			<Button className="flight-summary-buy" onClick={this.onAction}>{buttonText}</Button>
		</div>;
	}

	render(): React.ReactNode {
		return <Flight {...this.props} showFilters={true} renderActionBlock={this.renderActionBlock}/>;
	}
}

export default ResultsFlight;
