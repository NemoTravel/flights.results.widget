import * as React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import Typography from 'material-ui/Typography';

import Flight from '../schemas/Flight';
import SelectedFlights from './AlternativeFlights/SelectedFlights';
import Segment from './AlternativeFlights/Segment';
import { searchForAlternativeFlights } from '../store/actions';
import { ApplicationState, CommonThunkAction, FareFamiliesCombinationsState, SelectedFamiliesState } from '../state';
import { SelectedFamiliesAction, selectFamily } from '../store/alternativeFlights/selectedFamilies/actions';
import { getSelectedFlights } from '../store/selectedFlights/selectors';
import { goToLeg } from '../store/currentLeg/actions';

interface StateProps {
	selectedFlights: Flight[];
	selectedFamilies: SelectedFamiliesState;
	fareFamiliesCombinations: FareFamiliesCombinationsState;
}

interface DispatchProps {
	selectFamily: (segmentId: number, familyId: number) => SelectedFamiliesAction;
	searchForAlternativeFlights: () => CommonThunkAction;
	goToLeg: (legId: number) => CommonThunkAction;
}

type Props = StateProps & DispatchProps;

class AlternativeFlights extends React.Component<Props> {
	componentDidMount(): void {
		this.props.searchForAlternativeFlights();
	}

	render(): React.ReactNode {
		const { selectedFamilies, selectedFlights } = this.props;
		const segments = [0];

		return <section className="fareFamilies">
			<SelectedFlights flights={selectedFlights} goToLeg={this.props.goToLeg}/>

			<Typography className="fareFamilies-title" variant="display1">Выбор тарифа</Typography>

			<div className="alternativeFlights__legs">
				<div className="fareFamilies-leg">
					<div className="fareFamilies-leg__segments">
						{segments.map(segmentId => <Segment
							key={segmentId}
							segmentId={segmentId}
							selectedFamilyId={selectedFamilies[segmentId]}
							selectFamily={this.props.selectFamily}/>
						)}
					</div>
				</div>
			</div>
		</section>;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		selectedFlights: getSelectedFlights(state),
		fareFamiliesCombinations: state.alternativeFlights.fareFamiliesCombinations,
		selectedFamilies: state.alternativeFlights.selectedFamilies
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		selectFamily: bindActionCreators(selectFamily, dispatch),
		searchForAlternativeFlights: bindActionCreators(searchForAlternativeFlights, dispatch),
		goToLeg: bindActionCreators(goToLeg, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AlternativeFlights);
