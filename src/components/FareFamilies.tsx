import * as React from 'react';
import * as classnames from 'classnames';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Flight from '../models/Flight';
import SelectedFlights from './FareFamilies/SelectedFlights';
import Leg from './FareFamilies/Leg';
import { selectFamily } from '../store/fareFamilies/selectedFamilies/actions';
import { getSelectedFlights } from '../store/selectedFlights/selectors';
import { goBack, goToLeg } from '../store/currentLeg/actions';
import { getFareFamiliesAvailability, getFareFamiliesPrices } from '../store/fareFamilies/selectors';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import { isLoadingFareFamilies } from '../store/isLoadingFareFamilies/selectors';
import { RootState } from '../store/reducers';
import { FareFamiliesCombinationsState } from '../store/fareFamilies/fareFamiliesCombinations/reducers';
import { SelectedFamiliesState } from '../store/fareFamilies/selectedFamilies/reducers';
import { FareFamiliesPrices } from '../schemas/FareFamiliesPrices';
import { FareFamiliesAvailability } from '../schemas/FareFamiliesAvailability';

interface StateProps {
	selectedFlights: Flight[];
	isLoading: boolean;
	selectedFamilies: SelectedFamiliesState;
	fareFamiliesPrices: FareFamiliesPrices;
	fareFamiliesAvailability: FareFamiliesAvailability;
	fareFamiliesCombinations: FareFamiliesCombinationsState;
}

interface DispatchProps {
	selectFamily: typeof selectFamily;
	goToLeg: typeof goToLeg;
	goBack: typeof goBack;
}

type Props = StateProps & DispatchProps;

class FareFamilies extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.goBack = this.goBack.bind(this);
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
			fareFamiliesPrices,
			isLoading
		} = this.props;

		return <section className={classnames('fareFamilies', { fareFamilies_isLoading: isLoading })}>
			<SelectedFlights flights={selectedFlights} goToLeg={goToLeg}/>

			<div className="fareFamilies-loader">
				<CircularProgress color="secondary" variant="indeterminate"/>
			</div>

			<div className="fareFamilies__inner">
				<Typography className="fareFamilies-title" variant="headline">Выбор тарифа</Typography>

				<div className="fareFamilies__legs">
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
			</div>
		</section>;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		selectedFlights: getSelectedFlights(state),
		isLoading: isLoadingFareFamilies(state),
		fareFamiliesAvailability: getFareFamiliesAvailability(state),
		fareFamiliesPrices: getFareFamiliesPrices(state),
		fareFamiliesCombinations: state.fareFamilies.fareFamiliesCombinations,
		selectedFamilies: state.fareFamilies.selectedFamilies
	};
};

const mapDispatchToProps = {
	selectFamily,
	goToLeg,
	goBack
};

export default connect(mapStateToProps, mapDispatchToProps)(FareFamilies);
