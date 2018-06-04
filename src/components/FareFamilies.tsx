import * as React from 'react';
import * as classnames from 'classnames';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import Flight from '../models/Flight';
import Leg from './FareFamilies/Leg';
import { selectFamily } from '../store/fareFamilies/selectedFamilies/actions';
import { getSelectedFlights } from '../store/selectedFlights/selectors';
import { goToLeg } from '../store/currentLeg/actions';
import {
	getFareFamiliesAvailability, getFareFamiliesCombinations,
	getFareFamiliesPrices
} from '../store/fareFamilies/selectors';
import { isLoadingFareFamilies } from '../store/isLoadingFareFamilies/selectors';
import { FareFamiliesCombinationsState } from '../store/fareFamilies/fareFamiliesCombinations/reducers';
import { FareFamiliesPrices } from '../schemas/FareFamiliesPrices';
import { FareFamiliesAvailability } from '../schemas/FareFamiliesAvailability';
import { connect } from '../utils';
import Toolbar from './Toolbar';

interface StateProps {
	selectedFlights: Flight[];
	isLoading: boolean;
	fareFamiliesPrices: FareFamiliesPrices;
	fareFamiliesAvailability: FareFamiliesAvailability;
	fareFamiliesCombinations: FareFamiliesCombinationsState;
}

interface DispatchProps {
	selectFamily: typeof selectFamily;
	goToLeg: typeof goToLeg;
}

type Props = StateProps & DispatchProps;

class FareFamilies extends React.Component<Props> {
	render(): React.ReactNode {
		const {
			selectedFlights,
			fareFamiliesCombinations,
			fareFamiliesAvailability,
			goToLeg,
			selectFamily,
			fareFamiliesPrices,
			isLoading
		} = this.props;

		return <section className={classnames('fareFamilies', { fareFamilies_isLoading: isLoading })}>
			<div className="fareFamilies-loader">
				<CircularProgress color="secondary" variant="indeterminate"/>
			</div>

			<div className="fareFamilies__inner">
				<Typography className="fareFamilies-title" variant="headline">Выбор тарифа</Typography>

				<div className="fareFamilies__legs">
					{selectedFlights.map((flight, legId) => (
						<Leg
							key={flight.id}
							goToLeg={goToLeg}
							flight={flight}
							prices={fareFamiliesPrices ? fareFamiliesPrices[legId] : {}}
							combinations={fareFamiliesCombinations[legId]}
							availability={fareFamiliesAvailability[legId]}
							selectFamily={selectFamily}
						/>
					))}
				</div>
			</div>

			<Toolbar/>
		</section>;
	}
}

export default connect<StateProps, DispatchProps>({
	selectedFlights: getSelectedFlights,
	isLoading: isLoadingFareFamilies,
	fareFamiliesAvailability: getFareFamiliesAvailability,
	fareFamiliesPrices: getFareFamiliesPrices,
	fareFamiliesCombinations: getFareFamiliesCombinations
}, {
	selectFamily,
	goToLeg
})(FareFamilies);
