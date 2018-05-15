import * as React from 'react';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';

import { getCurrentLeg } from '../store/currentLeg/selectors';
import Leg from '../schemas/Leg';
import { ApplicationState } from '../state';
import FlightsList from './FlightsList';
import { hasAnyFlights } from '../store/flights/selectors';
import Sortings from './Sortings';
import FlightNumber from './Filters/FlightNumber';
import Filters from './Filters';
import { hasAnyVisibleFlights } from '../store/selectors';

interface StateProps {
	isLoading: boolean;
	hasAnyFlights: boolean;
	hasAnyVisibleFlights: boolean;
	currentLeg: Leg;
}

class Results extends React.Component<StateProps> {
	renderNoFlights(): React.ReactNode {
		return this.props.isLoading ? null : <Typography variant="headline">Нет результатов.</Typography>;
	}

	render(): React.ReactNode {
		const { currentLeg, hasAnyFlights, hasAnyVisibleFlights } = this.props;

		return hasAnyFlights ? <div className="results__inner-content">
			<FlightNumber/>

			<Filters currentLeg={currentLeg}/>

			{hasAnyVisibleFlights ? <Sortings/> : ''}

			<div className="results__flights">
				<FlightsList legId={currentLeg.id}/>
			</div>
		</div> : this.renderNoFlights();
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		isLoading: state.isLoading,
		hasAnyFlights: hasAnyFlights(state),
		hasAnyVisibleFlights: hasAnyVisibleFlights(state),
		currentLeg: getCurrentLeg(state)
	};
};

export default connect(mapStateToProps)(Results);
