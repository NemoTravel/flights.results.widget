import * as React from 'react';
import * as classnames from 'classnames';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';

import Flight from '../models/Flight';
import Leg from './FareFamilies/Leg';
import { selectFamily } from '../store/fareFamilies/selectedFamilies/actions';
import { getSelectedFlights } from '../store/selectedFlights/selectors';
import { goToLeg } from '../store/currentLeg/actions';
import {
	canBeOtherCombinationChoose,
	getFareFamiliesAvailability, getFareFamiliesCombinations,
	getFareFamiliesPrices
} from '../store/fareFamilies/selectors';
import { isLoadingFareFamilies } from '../store/isLoadingFareFamilies/selectors';
import { FareFamiliesCombinationsState } from '../store/fareFamilies/fareFamiliesCombinations/reducers';
import { FareFamiliesPrices } from '../schemas/FareFamiliesPrices';
import { FareFamiliesAvailability } from '../schemas/FareFamiliesAvailability';
import { connect } from '../utils';
import Toolbar from './Toolbar';
import { isRT } from '../store/legs/selectors';
import { i18n } from '../i18n';
import { getIsLoadingActualization } from '../store/isLoadingActualization/selectors';
import { getNemoURL } from '../store/config/selectors';
import ErrorHandler from './Actualization/ErrorHandler';

interface StateProps {
	selectedFlights: Flight[];
	isLoading: boolean;
	isLoadingActualization: boolean;
	canBeOtherCombinationChoose: boolean;
	isRT: boolean;
	nemoURL: string;
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
			isLoading,
			isLoadingActualization,
			canBeOtherCombinationChoose,
			isRT,
			nemoURL
		} = this.props;

		if (isLoading || (isLoadingActualization && !canBeOtherCombinationChoose)) {
			return <div className="fareFamilies-loader">
				<LinearProgress className="fareFamilies-loader__progressBar" color="secondary" variant="query"/>
				<Typography variant="headline">{i18n(isLoading ? 'fareFamilies-loader-title' : 'fareFamilies-actualization-loader-title')}</Typography>
			</div>;
		}

		const classNames = classnames('fareFamilies', { fareFamilies_isLoading: isLoading });

		return <section className={classNames}>
			<div className="fareFamilies__inner">
				{!isRT && (
					<Typography className="fareFamilies-title" variant="headline">{i18n('fareFamilies-title')}</Typography>
				)}

				<div className="fareFamilies__legs">
					{selectedFlights.map((flight, legId) => (
						<Leg
							key={flight.id}
							goToLeg={goToLeg}
							nemoURL={nemoURL}
							flight={flight}
							prices={fareFamiliesPrices ? fareFamiliesPrices[legId] : {}}
							combinations={fareFamiliesCombinations[legId]}
							availability={fareFamiliesAvailability[legId]}
							selectFamily={selectFamily}
							showTitle={isRT}
						/>
					))}
				</div>
			</div>

			{(isLoadingActualization && canBeOtherCombinationChoose) && (
				<div className="actualization">
					<div className="actualization-loader">
						<CircularProgress className="actualization-loader__progress" color="primary" variant="indeterminate"/>
					</div>
				</div>
			)}

			<Toolbar/>
			<ErrorHandler/>
		</section>;
	}
}

export default connect<StateProps, DispatchProps>({
	selectedFlights: getSelectedFlights,
	isLoading: isLoadingFareFamilies,
	isLoadingActualization: getIsLoadingActualization,
	canBeOtherCombinationChoose: canBeOtherCombinationChoose,
	isRT: isRT,
	nemoURL: getNemoURL,
	fareFamiliesAvailability: getFareFamiliesAvailability,
	fareFamiliesPrices: getFareFamiliesPrices,
	fareFamiliesCombinations: getFareFamiliesCombinations
}, {
	selectFamily,
	goToLeg
})(FareFamilies);
