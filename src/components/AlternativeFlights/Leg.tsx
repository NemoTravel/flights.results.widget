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
		const { flight, selectedFamilies, selectFamily, combinations } = this.props;

		return <div className="fareFamilies-leg">
			<div className="fareFamilies-leg__segments">
				{flight.segments.map((segment, index) => (
					<Segment
						key={index}
						combinations={combinations}
						segmentId={index}
						selectedFamilyId={selectedFamilies[index]}
						selectFamily={selectFamily}
					/>
				))}
			</div>
		</div>;
	}
}

export default Leg;
