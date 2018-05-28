import * as React from 'react';
import autobind from 'autobind-decorator';
import Typography from '@material-ui/core/Typography/Typography';

import Segment from './Segment';
import Flight from '../../models/Flight';
import FareFamiliesCombinations from '../../schemas/FareFamiliesCombinations';
import { SelectedFamiliesState } from '../../store/fareFamilies/selectedFamilies/reducers';
import { selectFamily } from '../../store/fareFamilies/selectedFamilies/actions';
import Money from '../../schemas/Money';

interface Props {
	id: number;
	isRT?: boolean;
	flight: Flight;
	prices: { [segmentId: number]: { [familyId: string]: Money } };
	selectedFamilies: SelectedFamiliesState;
	combinations: FareFamiliesCombinations;
	selectFamily: typeof selectFamily;
	availability: { [segmentId: number]: { [familyId: string]: boolean } };
}

class Leg extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.id !== nextProps.id ||
			this.props.isRT !== nextProps.isRT ||
			this.props.prices !== nextProps.prices ||
			this.props.selectedFamilies !== nextProps.selectedFamilies ||
			this.props.combinations !== nextProps.combinations ||
			this.props.availability !== nextProps.availability ||
			this.props.flight !== nextProps.flight;
	}

	@autobind
	onChange(segmentId: number, familyId: string): void {
		this.props.selectFamily(this.props.id, segmentId, familyId);
	}

	render(): React.ReactNode {
		const { flight, combinations, prices, availability, isRT, id } = this.props;
		const initialCombinationsBySegments = combinations ? combinations.initialCombination.split('_') : '';

		return <div className="fareFamilies-leg">
			{isRT && id === 0 ? <Typography variant="headline" className="fareFamilies-title">Выбор тарифа туда</Typography> : null}
			{isRT && id === 1 ? <Typography variant="headline" className="fareFamilies-title">Выбор тарифа обратно</Typography> : null}

			<div className="fareFamilies-leg__segments">
				{flight.segments.map((segment, index) => {
					const segmentId = `S${index}`;
					const enabledFamilies = availability ? availability[index] : {};
					const families = combinations ? combinations.fareFamiliesBySegments[segmentId] : [];

					return <Segment
						key={segmentId}
						segmentId={segmentId}
						segment={segment}
						enabledFamilies={enabledFamilies}
						initialCombination={initialCombinationsBySegments[index]}
						families={families}
						isAvailable={!!combinations && !!families}
						onChange={this.onChange}
						prices={prices ? prices[index] : {}}
					/>;
				})}
			</div>
		</div>;
	}
}

export default Leg;
