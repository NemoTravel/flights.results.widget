import * as React from 'react';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

import Family from './Family';
import { SelectedFamiliesAction } from '../../store/alternativeFlights/selectedFamilies/actions';
import FareFamiliesCombinations from '../../schemas/FareFamiliesCombinations';
import FareFamily from '../../schemas/FareFamily';
import SegmentModel from '../../schemas/Segment';

interface Props {
	initialCombination: string;
	segment: SegmentModel;
	segmentId: string;
	selectFamily: (segmentId: number, familyId: number) => SelectedFamiliesAction;
	families: FareFamily[];
	isAvailable: boolean;
}

interface State {
	selectedFamilyId: string;
}

class Segment extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			selectedFamilyId: props.initialCombination
		};

		this.selectFamilyWrapper = this.selectFamilyWrapper.bind(this);
	}

	selectFamilyWrapper(familyId: string): void {
		this.setState({
			selectedFamilyId: familyId
		});
	}

	renderContent(): React.ReactNode {
		const { initialCombination, families } = this.props;
		const selectedFamilyId = this.state.selectedFamilyId || initialCombination;

		return <form className="fareFamilies-leg-segment__families">
			{families.map((family, index) => {
				const familyId = `F${index + 1}`;

				return <Family
					key={familyId}
					id={familyId}
					selectFamily={this.selectFamilyWrapper}
					family={family}
					isSelected={selectedFamilyId === familyId}
				/>;
			})}
		</form>;
	}

	render(): React.ReactNode {
		const { isAvailable, segment } = this.props;

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

				{isAvailable ? '' : <span className="fareFamilies-leg-segment-title__disclaimer">Выбор тарифа недоступен</span>}
			</div>

			{isAvailable ? this.renderContent() : ''}
		</Paper>;
	}
}

export default Segment;
