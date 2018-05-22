import * as React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Typography from 'material-ui/Typography';
import CircularProgress from 'material-ui/Progress/CircularProgress';

import { getCurrentLeg } from '../store/currentLeg/selectors';
import Leg from '../schemas/Leg';
import { RootState } from '../store/reducers';
import FlightsList from './FlightsList';
import { hasAnyFlights } from '../store/flights/selectors';
import Sortings from './Sortings';
import Filters from './Filters';
import { hasAnyVisibleFlights } from '../store/selectors';
import { isRT } from '../store/legs/selectors';
import SelectedFlights from './SelectedFlights';
import { getSelectedFlights } from '../store/selectedFlights/selectors';
import { getIsLoading } from '../store/isLoading/selectors';
import FlightModel from '../models/Flight';
import { mapStateToProps } from '../utils';

interface StateProps {
	isRT: boolean;
	isLoading: boolean;
	hasAnyFlights: boolean;
	hasAnyVisibleFlights: boolean;
	currentLeg: Leg;
	selectedFlights: FlightModel[];
}

class Results extends React.Component<StateProps> {
	renderNoFlights(): React.ReactNode {
		return this.props.isLoading ? null : <Typography variant="headline">Нет результатов.</Typography>;
	}

	render(): React.ReactNode {
		const { currentLeg, hasAnyFlights, hasAnyVisibleFlights, isLoading, isRT, selectedFlights } = this.props;

		if (isLoading) {
			return <div className="results-loader">
				<CircularProgress color="secondary" variant="indeterminate"/>
			</div>;
		}

		return hasAnyFlights ? <>
			<div className="results__inner-content">
				<SelectedFlights selectedFlights={selectedFlights}/>

				<Filters currentLeg={currentLeg} isRT={isRT}/>

				{hasAnyVisibleFlights ? <Sortings/> : ''}

				<div className="results-flights">
					<FlightsList legId={currentLeg.id}/>
				</div>
			</div>
		</> : this.renderNoFlights();
	}
}

export default connect(mapStateToProps<StateProps>({
	isRT: isRT,
	isLoading: getIsLoading,
	hasAnyFlights: hasAnyFlights,
	hasAnyVisibleFlights: hasAnyVisibleFlights,
	currentLeg: getCurrentLeg,
	selectedFlights: getSelectedFlights
}))(Results);
