import * as React from 'react';
import SegmentModel from '../../schemas/Segment';
import * as moment from 'moment';

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

	render(): React.ReactNode {
		const segment = this.props.segment;
		const totalFlightTime = segment.flightTime + segment.waitingTime;
		const totalFlightTimeHuman = moment.duration(totalFlightTime, 'seconds').format('d [д] h [ч] m [мин]');
		const isDirect = !segment.nextSegment;
		const waitingTime = moment.duration(segment.waitingTime, 'seconds').format('d [д] h [ч] m [мин]');
		const brandName = segment.tariffFeatures ? segment.tariffFeatures.fareFamilyName : '';

		return <div className="flight-details-segment">
			<div className="flight-details-segment__wrapper">
				<div className="flight-details-segment__left">
					<div className="flight-details-segment-logo">
						<img className="flight-details-segment-logo__image" src={`http://release.mlsd.ru${segment.airline.logoIcon}`}/>
					</div>

					<div className="flight-details-segment-stage">
						<div className="flight-details-segment-stage__time">
							{segment.depDate.format('HH:MM')}
						</div>

						<div className="flight-details-segment-stage__date">
							{segment.depDate.format('DD MMM')}
						</div>
					</div>

					<div className="flight-details-segment-stage-routeInfo">
						<div className="flight-details-segment-stage-routeInfo__arrow"/>
						<span className="flight-details-segment-stage-routeInfo__flightTime">{totalFlightTimeHuman}</span>
					</div>

					<div className="flight-details-segment-stage">
						<div className="flight-details-segment-stage__time">
							{segment.arrDate.format('HH:MM')}
						</div>

						<div className="flight-details-segment-stage__date">
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
					{brandName ? `Тариф «${brandName}»` : ''}
				</div>
			</div>

			{isDirect ? null : (
				<div className="flight-details-segment-transfer">
					{TransferIcon} Пересадка {waitingTime} – {segment.arrAirport.city.name}
				</div>
			)}
		</div>;
	}
}

export default Segment;
