import * as React from 'react';
import * as moment from 'moment';

import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import FlightModel from '../schemas/Flight';
import Segment from '../schemas/Segment';

interface Props {
	flight: FlightModel;
}

const millisecondsInSecond = 1000;

const secondsToString = (seconds: number): string => moment.utc(seconds * millisecondsInSecond).format('H mm');

class Flight extends React.Component<Props> {
	render(): React.ReactNode {
		const flight = this.props.flight;
		const firstSegment = flight.segments[0];
		const lastSegment = flight.segments[flight.segments.length - 1];
		const totalFlightTime = flight.segments.reduce((result: number, segment: Segment) => result + segment.flightTime + segment.waitingTime, 0);

		const duration = moment.duration(totalFlightTime, 'seconds');

		return <ExpansionPanel className="flight">
			<ExpansionPanelSummary className="flight-summary">
				<div className="flight-summary__left">
					<div className="flight-summary-logo">
						<img className="flight-summary-logo__image" src={`http://nemo1${firstSegment.airline.logoIcon}`}/>
					</div>

					<div className="flight-summary-stage">
						<div className="flight-summary-stage__time">
							<Typography variant="headline">{firstSegment.depDate.format('HH:MM')}</Typography>
						</div>

						<div className="flight-summary-stage__location">
							<Typography variant="caption">{firstSegment.depAirport.IATA}</Typography>
						</div>
					</div>

					<div className="flight-summary-stage-routeInfo">
						<div className="flight-summary-stage-routeInfo__arrow"/>
						<span className="flight-summary-stage-routeInfo__flightTime">{secondsToString(totalFlightTime)}</span>
					</div>

					<div className="flight-summary-stage">
						<div className="flight-summary-stage__time">
							<Typography variant="headline">{lastSegment.arrDate.format('HH:MM')}</Typography>
						</div>

						<div className="flight-summary-stage__location">
							<Typography variant="caption">{lastSegment.arrAirport.IATA}</Typography>
						</div>
					</div>
				</div>

				<div className="flight-summary__middle">
					<div className="flight-summary-transfers">
						{flight.segments.length === 1 ? 'прямой' : null}
						{flight.segments.length > 1 ? flight.segments.slice(0, flight.segments.length - 1).map((segment, index) => {
							const waitingTime = secondsToString(segment.waitingTime);

							return <div key={index}>{waitingTime} пересадка в городе {segment.arrAirport.city.name}</div>;
						}) : null}
					</div>

					<div className="flight-summary-route">
						{firstSegment.depAirport.name} &mdash; {lastSegment.arrAirport.name}
					</div>
				</div>

				<div className="flight-summary__right">
					<div className="flight-summary-price">
						<div className="flight-summary-price__amount">
							{flight.segmentGroups.length > 1 ? 'от' : null} <Typography className="flight-summary-price__amount-wrapper" variant="title">${flight.totalPrice.amount}</Typography>
						</div>

						{flight.segmentGroups.length > 1 ? <div className="flight-summary-price__scope">
							туда и обратно
						</div> : null}
					</div>

					<div className="flight-summary-buy">
						<Button variant="raised" color="secondary">Выбрать</Button>
					</div>
				</div>
			</ExpansionPanelSummary>

			<ExpansionPanelDetails className="flight-details">
				Информация
			</ExpansionPanelDetails>
		</ExpansionPanel>;
	}
}

export default Flight;
