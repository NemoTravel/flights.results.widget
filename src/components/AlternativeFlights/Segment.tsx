import * as React from 'react';
import Typography from 'material-ui/Typography';

import Family from './Family';
import { SelectedFamiliesAction } from '../../store/alternativeFlights/selectedFamilies/actions';
import FareFamiliesCombinations from '../../schemas/FareFamiliesCombinations';
import FareFamily from '../../schemas/FareFamily';

interface Props {
	segmentId: number;
	selectFamily: (segmentId: number, familyId: number) => SelectedFamiliesAction;
	selectedFamilyId: number;
	combinations: FareFamiliesCombinations;
}

class Segment extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.selectFamilyWrapper = this.selectFamilyWrapper.bind(this);
	}

	selectFamilyWrapper(familyId: number): void {
		this.props.selectFamily(this.props.segmentId, familyId);
	}

	render(): React.ReactNode {
		const { selectedFamilyId, combinations, segmentId } = this.props;
		const stringSegmentId = 'S' + segmentId;
		const families: FareFamily[] = combinations.fareFamiliesBySegments[stringSegmentId];

		console.log(segmentId);

		return <div className="fareFamilies-leg-segment">
			<Typography className="fareFamilies-leg-segment__title" variant="headline">
				Саратов &mdash; Москва, 24 июня
			</Typography>

			<form className="fareFamilies-leg-segment__families">
				{families.map((family, index) => (
					<Family
						key={index}
						id={index}
						selectFamily={this.selectFamilyWrapper}
						family={family}
						isSelected={selectedFamilyId === index}
					/>
				))}
			</form>
		</div>;
	}
}

export default Segment;
