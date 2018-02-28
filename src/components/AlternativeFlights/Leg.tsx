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

export interface EnabledFamilies {
	[familyId: string]: boolean;
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
		const validCombinations = combinations ? combinations.validCombinations : {};
		const enabledFamiliesBySegments: { [segmentId: number]: EnabledFamilies } = {};

		// @FIXME переделать на селекторы
		for (const combination in validCombinations) {
			if (validCombinations.hasOwnProperty(combination)) {
				const combinationParts = combination.split('_');

				combinationParts.forEach((familyId, segmentId) => {
					if (!enabledFamiliesBySegments[segmentId]) {
						enabledFamiliesBySegments[segmentId] = {};
					}

					enabledFamiliesBySegments[segmentId][familyId] = true;
				});
			}
		}

		return <div className="fareFamilies-leg">
			<div className="fareFamilies-leg__segments">
				{flight.segments.map((segment, index) => {
					const segmentId = `S${index}`;
					const enabledFamilies = enabledFamiliesBySegments[index];
					const families = combinations ? combinations.fareFamiliesBySegments[segmentId] : [];

					return <Segment
						key={segmentId}
						segmentId={segmentId}
						segment={segment}
						enabledFamilies={enabledFamilies}
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
