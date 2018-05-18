import * as React from 'react';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';

import { getCurrentLeg } from '../store/currentLeg/selectors';
import Leg from '../schemas/Leg';
import { RootState } from '../store/reducers';
import FlightsList from './FlightsList';
import { hasAnyFlights } from '../store/flights/selectors';
import Sortings from './Sortings';
import Filters from './Filters';
import { hasAnyVisibleFlights } from '../store/selectors';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import { isRT } from '../store/legs/selectors';

interface StateProps {
	isRT: boolean;
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
		const { currentLeg, hasAnyFlights, hasAnyVisibleFlights, isLoading, isRT } = this.props;

		if (isLoading) {
			return <div className="results-loader">
				<CircularProgress color="secondary" variant="indeterminate"/>
			</div>;
		}

		return hasAnyFlights ? <>
			<div className="results__inner-content">
				<Filters currentLeg={currentLeg} isRT={isRT}/>

				{hasAnyVisibleFlights ? <Sortings/> : ''}

				<div className="results__flights">
					<FlightsList legId={currentLeg.id}/>
				</div>
			</div>
		</> : this.renderNoFlights();
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		isRT: isRT(state),
		isLoading: state.isLoading,
		hasAnyFlights: hasAnyFlights(state),
		hasAnyVisibleFlights: hasAnyVisibleFlights(state),
		currentLeg: getCurrentLeg(state)
	};
};

export default connect(mapStateToProps)(Results);
