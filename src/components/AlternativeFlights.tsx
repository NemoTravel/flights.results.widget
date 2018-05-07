import * as React from 'react';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import * as State from '../state';
import Flight from '../models/Flight';
import SelectedFlights from './AlternativeFlights/SelectedFlights';
import Leg from './AlternativeFlights/Leg';
import { searchForAlternativeFlights } from '../store/actions';
import { SelectFamily, selectFamily } from '../store/alternativeFlights/selectedFamilies/actions';
import { getSelectedFlights } from '../store/selectedFlights/selectors';
import { goBack, goToLeg } from '../store/currentLeg/actions';
import { getFareFamiliesAvailability, getFareFamiliesPrices } from '../store/alternativeFlights/selectors';

interface StateProps {
	selectedFlights: Flight[];
	selectedFamilies: State.SelectedFamiliesState;
	fareFamiliesPrices: State.FareFamiliesPricesState;
	fareFamiliesAvailability: State.FareFamiliesAvailabilityState;
	fareFamiliesCombinations: State.FareFamiliesCombinationsState;
}

interface DispatchProps {
	selectFamily: SelectFamily;
	searchForAlternativeFlights: () => State.CommonThunkAction;
	goToLeg: (legId: number) => State.CommonThunkAction;
	goBack: () => State.CommonThunkAction;
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

const mapStateToProps = (state: State.ApplicationState): StateProps => {
	return {
		selectedFlights: getSelectedFlights(state),
		fareFamiliesAvailability: getFareFamiliesAvailability(state),
		fareFamiliesPrices: getFareFamiliesPrices(state),
		fareFamiliesCombinations: state.alternativeFlights.fareFamiliesCombinations,
		selectedFamilies: state.alternativeFlights.selectedFamilies
	};
};

const mapDispatchToProps = {
	selectFamily,
	searchForAlternativeFlights,
	goToLeg,
	goBack
};

export default connect(mapStateToProps, mapDispatchToProps)(AlternativeFlights);
