import * as React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import Typography from 'material-ui/Typography';

import Flight from '../schemas/Flight';
import SelectedFlights from './AlternativeFlights/SelectedFlights';
import Leg from './AlternativeFlights/Leg';
import { searchForAlternativeFlights } from '../store/actions';
import {
	ApplicationState, CommonThunkAction, FareFamiliesAvailabilityState, FareFamiliesCombinationsState,
	FareFamiliesPricesState,
	SelectedFamiliesState
} from '../state';
import { SelectFamily, selectFamily } from '../store/alternativeFlights/selectedFamilies/actions';
import { getSelectedFlights } from '../store/selectedFlights/selectors';
import { goBack, goToLeg } from '../store/currentLeg/actions';
import { getFareFamiliesAvailability, getFareFamiliesPrices } from '../store/alternativeFlights/selectors';
import Button from 'material-ui/Button';

interface StateProps {
	selectedFlights: Flight[];
	selectedFamilies: SelectedFamiliesState;
	fareFamiliesPrices: FareFamiliesPricesState;
	fareFamiliesAvailability: FareFamiliesAvailabilityState;
	fareFamiliesCombinations: FareFamiliesCombinationsState;
}

interface DispatchProps {
	selectFamily: SelectFamily;
	searchForAlternativeFlights: () => CommonThunkAction;
	goToLeg: (legId: number) => CommonThunkAction;
	goBack: () => CommonThunkAction;
}

type Props = StateProps & DispatchProps;

class AlternativeFlights extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.goBack = this.goBack.bind(this);
	}

	componentDidMount(): void {
		this.props.searchForAlternativeFlights();
	}

	goBack(): void {
		this.props.goBack();
	}

	render(): React.ReactNode {
		const {
			selectedFamilies,
			selectedFlights,
			fareFamiliesCombinations,
			fareFamiliesAvailability,
			goToLeg,
			selectFamily,
			fareFamiliesPrices
		} = this.props;

		return <section className="fareFamilies">
			<SelectedFlights flights={selectedFlights} goToLeg={goToLeg}/>

			<Typography className="fareFamilies-title" variant="headline">Выбор тарифа</Typography>

			<div className="alternativeFlights__legs">
				{selectedFlights.map((flight, legId) => (
					<Leg
						key={flight.id}
						id={legId}
						flight={flight}
						prices={fareFamiliesPrices ? fareFamiliesPrices[legId] : {}}
						selectedFamilies={selectedFamilies}
						combinations={fareFamiliesCombinations[legId]}
						availability={fareFamiliesAvailability[legId]}
						selectFamily={selectFamily}
					/>
				))}
			</div>

			<Button variant="raised" onClick={this.goBack}>Назад</Button>
		</section>;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		selectedFlights: getSelectedFlights(state),
		fareFamiliesAvailability: getFareFamiliesAvailability(state),
		fareFamiliesPrices: getFareFamiliesPrices(state),
		fareFamiliesCombinations: state.alternativeFlights.fareFamiliesCombinations,
		selectedFamilies: state.alternativeFlights.selectedFamilies
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		selectFamily: bindActionCreators(selectFamily, dispatch),
		searchForAlternativeFlights: bindActionCreators(searchForAlternativeFlights, dispatch),
		goToLeg: bindActionCreators(goToLeg, dispatch),
		goBack: bindActionCreators(goBack, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AlternativeFlights);
