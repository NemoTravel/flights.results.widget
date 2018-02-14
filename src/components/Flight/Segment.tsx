import * as React from 'react';
import SegmentModel from '../../schemas/Segment';
import * as moment from 'moment';

interface Props {
	segment: SegmentModel;
}

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

		return <div className="flight-details-segment">
			<div className="flight-details-segment__wrapper">
				<div className="flight-summary-logo">
					<img className="flight-summary-logo__image" src={`http://nemo1${segment.airline.logoIcon}`}/>
				</div>

				<div className="flight-summary-stage">
					<div className="flight-summary-stage__time">
						{segment.depDate.format('HH:MM')}
					</div>

					<div className="flight-summary-stage__location">
						{segment.depAirport.IATA}
					</div>
				</div>

				<div className="flight-summary-stage-routeInfo">
					<div className="flight-summary-stage-routeInfo__arrow"/>
					<span className="flight-summary-stage-routeInfo__flightTime">{totalFlightTimeHuman}</span>
				</div>

				<div className="flight-summary-stage">
					<div className="flight-summary-stage__time">
						{segment.arrDate.format('HH:MM')}
					</div>

					<div className="flight-summary-stage__location">
						{segment.arrAirport.IATA}
					</div>
				</div>
			</div>

			{isDirect ? null : (
				<div className="flight-details-segment-transfer">
					Пересадка {waitingTime} – {segment.arrAirport.city.name} ({segment.arrAirport.IATA})
				</div>
			)}
		</div>;
	}
}

export default Segment;
