import * as React from 'react';
import * as classnames from 'classnames';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import StarIcon from '@material-ui/icons/Stars';
import autobind from 'autobind-decorator';

import Price from './Price';
import Flight from './Flight';
import { selectFlight } from '../store/selectedFlights/actions';
import SelectedFlight from '../schemas/SelectedFlight';
import FlightModel from '../models/Flight';
import Money from '../schemas/Money';
import { i18n } from '../i18n';

interface Props {
	flight: FlightModel;
	selectFlight: typeof selectFlight;
	showPricePrefix: boolean;
	replacement: SelectedFlight;
	totalPrice: Money;
	currentLegId: number;
	nemoURL: string;
	isHidden: boolean;
	isFirstVisible: boolean;
}

class ResultsFlight extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return (
			this.props.flight.id !== nextProps.flight.id ||
			this.props.totalPrice !== nextProps.totalPrice ||
			this.props.isHidden !== nextProps.isHidden ||
			this.props.isFirstVisible !== nextProps.isFirstVisible ||
			this.props.replacement !== nextProps.replacement
		);
	}

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
		let buttonText = <span>{i18n('results-flight-buyTitle')}</span>;

		if (totalPrice) {
			buttonText = <Price price={totalPrice}/>;
		}

		const block = <div className="flight-summary__right">
			<div className="flight-summary-price">
				<div className={classnames('flight-summary-price__amount', { 'flight-summary-price__amount_profitable': price.amount < 0 })}>
					{showPricePrefix && <span className="flight-summary-price__amount-prefix">{i18n('utils-pre-from')}</span>}

					<Price withPlus={currentLegId !== 0} price={price}/>
				</div>

				{price.amount < 0 && (
					<div className="flight-summary-price-profitMark">
						<div className="flight-summary-price-profitMark__icon">
							<StarIcon/>
						</div>

						<span className="flight-summary-price-profitMark__text">{i18n('results-flight-profitable-title')}</span>
					</div>
				)}

				{currentLegId === 0 && (
					<div className="flight-summary-price__route">
						{i18n('results-flight-wholeFlightTitle')}
					</div>
				)}
			</div>

			<div className="flight-summary-buy" onClick={this.onAction}>{buttonText}</div>
		</div>;

		return price.amount < 0 ? (
			<Tooltip title={<span className="tooltip">{i18n('results-flight-profitable-tooltip_1')}<br/>{i18n('results-flight-profitable-tooltip_2')}</span>} placement="top">{block}</Tooltip>
		) : block;
	}

	render(): React.ReactNode {
		return (
			<Flight
				{...this.props}
				className={classnames('flight', {
					flight_hidden: this.props.isHidden,
					flight_visible: !this.props.isHidden,
					flight_firstVisible: this.props.isFirstVisible
				})}
				showFilters={true}
				renderActionBlock={this.renderActionBlock}
			/>
		);
	}
}

export default ResultsFlight;
