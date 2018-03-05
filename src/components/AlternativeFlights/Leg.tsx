import * as React from 'react';

import Segment from './Segment';
import Flight from '../../schemas/Flight';
import FareFamiliesCombinations from '../../schemas/FareFamiliesCombinations';
import { SelectedFamiliesState } from '../../state';
import { SelectFamily } from '../../store/alternativeFlights/selectedFamilies/actions';
import Money from '../../schemas/Money';

interface Props {
	id: number;
	flight: Flight;
	prices: { [segmentId: number]: { [familyId: string]: Money } };
	selectedFamilies: SelectedFamiliesState;
	combinations: FareFamiliesCombinations;
	selectFamily: SelectFamily;
	availability: { [segmentId: number]: { [familyId: string]: boolean } };
}

class Leg extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.onChange = this.onChange.bind(this);
	}

	onChange(segmentId: number, familyId: string): void {
		this.props.selectFamily(this.props.id, segmentId, familyId);
	}

	render(): React.ReactNode {
		const { flight, combinations, prices, availability } = this.props;
		const initialCombinationsBySegments = combinations ? combinations.initialCombination.split('_') : '';

		return <div className="fareFamilies-leg">
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
