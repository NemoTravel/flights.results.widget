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

	renderContent(): React.ReactNode {
		const { selectedFamilyId, combinations, segmentId } = this.props;
		const stringSegmentId = 'S' + segmentId.toString();
		const families: FareFamily[] = combinations.fareFamiliesBySegments[stringSegmentId];

		return <form className="fareFamilies-leg-segment__families">
			{families.map((family, index) => (
				<Family
					key={index}
					id={index}
					selectFamily={this.selectFamilyWrapper}
					family={family}
					isSelected={selectedFamilyId === index}
				/>
			))}
		</form>;
	}

	render(): React.ReactNode {
		const { combinations, segment } = this.props;

		return <Paper className="fareFamilies-leg-segment">
			<div className="fareFamilies-leg-segment-title">
				<div className="fareFamilies-leg-segment-title__left">
					<div className="fareFamilies-leg-segment-title-logo">
						<img src={`http://mlsd.ru:9876${segment.airline.logoIcon}`}/>
					</div>

					<Typography variant="headline">
						{segment.depAirport.city.name}&nbsp;&mdash;&nbsp;{segment.arrAirport.city.name},&nbsp;{segment.depDate.format('DD MMM')}
					</Typography>
				</div>

				{combinations ? '' : <span className="fareFamilies-leg-segment-title__disclaimer">Выбор тарифа недоступен</span>}
			</div>

			{combinations ? this.renderContent() : ''}
		</Paper>;
	}
}

export default Segment;
