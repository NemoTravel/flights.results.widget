import * as React from 'react';
import * as classnames from 'classnames';
import * as moment from 'moment';

import SegmentModel from '../../schemas/Segment';
import { declension, fixImageURL } from '../../utils';

interface Props {
	segment: SegmentModel;
}

const TransferIcon = <svg fill="#000000" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
	<path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/>
	<path d="M0 0h24v24H0z" fill="none"/>
</svg>;

class Segment extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.segment !== nextProps.segment;
	}

	renderLogo(): React.ReactNode {
		const segment = this.props.segment;

		return this.props.segment.airline.logoIcon
			? <img className="flight-details-segment-logo__image" title={segment.airline.name} src={fixImageURL(segment.airline.logoIcon)}/>
			: <div className="flight-details-segment-logo__text">{segment.airline.name}</div>;
	}

	render(): React.ReactNode {
		const segment = this.props.segment;
		const totalFlightTime = segment.flightTime + segment.waitingTime;
		const totalFlightTimeHuman = moment.duration(totalFlightTime, 'seconds').format('d [д] h [ч] m [мин]');
		const hasTransfer = !!segment.prevSegment;
		const waitingTime = moment.duration(segment.prevSegment.waitingTime, 'seconds').format('d [д] h [ч] m [мин]');
		const arrivalAtNextDay = segment.depDate.date() !== segment.arrDate.date();

		return <div className="flight-details-segment">
			{hasTransfer ? (
				<div className="flight-details-segment-transfer">
					{TransferIcon} {waitingTime} пересадка в {declension(segment.prevSegment.arrAirport.city.name)}
				</div>
			) : null}

			<div className="flight-details-segment__wrapper">
				<div className="flight-details-segment__left">
					<div className="flight-details-segment-logo">
						{this.renderLogo()}
					</div>

					<div className="flight-details-segment-stage flight-details-segment-stage_departure">
						<div className="flight-details-segment-stage__time">
							{segment.depDate.format('HH:mm')}
						</div>

						<div className="flight-details-segment-stage__date">
							{segment.depDate.format('DD MMM')}
						</div>
					</div>

					<div className="flight-details-segment-stage-routeInfo">
						<div className="flight-details-segment-stage-routeInfo__arrow"/>
						<span className="flight-details-segment-stage-routeInfo__flightTime">{totalFlightTimeHuman}</span>
					</div>

					<div className="flight-details-segment-stage flight-details-segment-stage_arrival">
						<div className="flight-details-segment-stage__time">
							{segment.arrDate.format('HH:mm')}
						</div>

						<div className={classnames('flight-details-segment-stage__date', { 'flight-details-segment-stage__date_warning': arrivalAtNextDay })}>
							{segment.arrDate.format('DD MMM')}
						</div>
					</div>
				</div>

				<div className="flight-details-segment__middle">
					<div>Рейс <strong>{segment.airline.IATA}-{segment.flightNumber}</strong>, {segment.aircraft.name}</div>

					<div className="flight-details-segment-route">
						{segment.depAirport.city.name}{segment.depAirport.city.name !== segment.depAirport.name ? ', ' + segment.depAirport.name : null}
						&nbsp;&mdash;&nbsp;
						{segment.arrAirport.city.name}{segment.arrAirport.city.name !== segment.arrAirport.name ? ', ' + segment.arrAirport.name : null}
					</div>
				</div>

				<div className="flight-details-segment__right">

				</div>
			</div>
		</div>;
	}
}

export default Segment;
