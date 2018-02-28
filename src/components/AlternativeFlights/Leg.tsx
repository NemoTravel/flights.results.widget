import * as React from 'react';

import Segment from './Segment';
import Flight from '../../schemas/Flight';
import FareFamiliesCombinations from '../../schemas/FareFamiliesCombinations';
import { SelectedFamiliesAction } from '../../store/alternativeFlights/selectedFamilies/actions';
import { SelectedFamiliesState } from '../../state';

interface Props {
	flight: Flight;
	selectedFamilies: SelectedFamiliesState;
	combinations: FareFamiliesCombinations;
	selectFamily: (segmentId: number, familyId: number) => SelectedFamiliesAction;
}

class Leg extends React.Component<Props> {
	render(): React.ReactNode {
		const { flight, selectFamily, combinations } = this.props;
		const initialCombinationsBySegments = combinations ? combinations.initialCombination.split('_') : '';

		return <div className="fareFamilies-leg">
			<div className="fareFamilies-leg__segments">
				{flight.segments.map((segment, index) => {
					const segmentId = `S${index}`;
					const families = combinations ? combinations.fareFamiliesBySegments[segmentId] : [];

					return <Segment
						key={segmentId}
						segmentId={segmentId}
						segment={segment}
						initialCombination={initialCombinationsBySegments[index]}
						families={families}
						isAvailable={!!combinations}
						selectFamily={selectFamily}
					/>;
				})}
			</div>
		</div>;
	}
}

export default Leg;
