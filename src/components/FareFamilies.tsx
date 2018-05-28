import * as React from 'react';
import * as classnames from 'classnames';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import autobind from 'autobind-decorator';

import Flight from '../models/Flight';
import Leg from './FareFamilies/Leg';
import { selectFamily } from '../store/fareFamilies/selectedFamilies/actions';
import { getSelectedFlights } from '../store/selectedFlights/selectors';
import { goToLeg } from '../store/currentLeg/actions';
import {
	getFareFamiliesAvailability, getFareFamiliesCombinations,
	getFareFamiliesPrices,
	getSelectedFamilies
} from '../store/fareFamilies/selectors';
import { isLoadingFareFamilies } from '../store/isLoadingFareFamilies/selectors';
import { FareFamiliesCombinationsState } from '../store/fareFamilies/fareFamiliesCombinations/reducers';
import { SelectedFamiliesState } from '../store/fareFamilies/selectedFamilies/reducers';
import { FareFamiliesPrices } from '../schemas/FareFamiliesPrices';
import { FareFamiliesAvailability } from '../schemas/FareFamiliesAvailability';
import { isRT } from '../store/legs/selectors';
import { connect } from '../utils';
import Toolbar from './Toolbar';

interface StateProps {
	selectedFlights: Flight[];
	isLoading: boolean;
	isRT: boolean;
	selectedFamilies: SelectedFamiliesState;
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
			selectedFamilies,
			selectedFlights,
			fareFamiliesCombinations,
			fareFamiliesAvailability,
			goToLeg,
			selectFamily,
			fareFamiliesPrices,
			isLoading,
			isRT
		} = this.props;

		return <section className={classnames('fareFamilies', { fareFamilies_isLoading: isLoading })}>
			<div className="fareFamilies-loader">
				<CircularProgress color="secondary" variant="indeterminate"/>
			</div>

			<div className="fareFamilies__inner">
				{isRT ? null : <Typography className="fareFamilies-title" variant="headline">Выбор тарифа</Typography>}

				<div className="fareFamilies__legs">
					{selectedFlights.map((flight, legId) => (
						<Leg
							key={flight.id}
							id={legId}
							isRT={isRT}
							flight={flight}
							prices={fareFamiliesPrices ? fareFamiliesPrices[legId] : {}}
							selectedFamilies={selectedFamilies}
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
	isRT: isRT,
	fareFamiliesAvailability: getFareFamiliesAvailability,
	fareFamiliesPrices: getFareFamiliesPrices,
	fareFamiliesCombinations: getFareFamiliesCombinations,
	selectedFamilies: getSelectedFamilies
}, {
	selectFamily,
	goToLeg
})(FareFamilies);
