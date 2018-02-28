import * as React from 'react';

import Segment from './Segment';
import Flight from '../../schemas/Flight';
import FareFamiliesCombinations from '../../schemas/FareFamiliesCombinations';
import { SelectFamily } from '../../store/alternativeFlights/selectedFamilies/actions';
import { SelectedFamiliesState } from '../../state';

interface Props {
	id: number;
	flight: Flight;
	selectedFamilies: SelectedFamiliesState;
	combinations: FareFamiliesCombinations;
	selectFamily: SelectFamily;
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
		const { flight, combinations } = this.props;
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
						onChange={this.onChange}
					/>;
				})}
			</div>
		</div>;
	}
}

export default Leg;
