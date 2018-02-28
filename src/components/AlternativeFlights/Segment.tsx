import * as React from 'react';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

import Family from './Family';
import { SelectedFamiliesAction } from '../../store/alternativeFlights/selectedFamilies/actions';
import FareFamiliesCombinations from '../../schemas/FareFamiliesCombinations';
import FareFamily from '../../schemas/FareFamily';
import SegmentModel from '../../schemas/Segment';

interface Props {
	segment: SegmentModel;
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
		const { selectedFamilyId, combinations, segmentId, segment } = this.props;
		const stringSegmentId = 'S' + segmentId.toString();
		const families: FareFamily[] = combinations.fareFamiliesBySegments[stringSegmentId];

		return <Paper className="fareFamilies-leg-segment">
			<div className="fareFamilies-leg-segment-title">
				<img className="fareFamilies-leg-segment-title__logo" src={`http://mlsd.ru:9876${segment.airline.logoIcon}`}/>
				<Typography variant="headline">
					{segment.depAirport.city.name}&nbsp;&mdash;&nbsp;{segment.arrAirport.city.name},&nbsp;{segment.depDate.format('DD MMM')}
				</Typography>
			</div>

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
		</Paper>;
	}
}

export default Segment;
