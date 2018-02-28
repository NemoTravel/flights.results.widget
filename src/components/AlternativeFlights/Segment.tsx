import * as React from 'react';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

import Family from './Family';
import FareFamily from '../../schemas/FareFamily';
import SegmentModel from '../../schemas/Segment';
import { EnabledFamilies } from './Leg';

interface Props {
	enabledFamilies: EnabledFamilies;
	initialCombination: string;
	segment: SegmentModel;
	segmentId: string;
	onChange: (segmentId: number, familyId: string) => void;
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

		this.onChange = this.onChange.bind(this);
	}

	onChange(familyId: string): void {
		this.setState({
			selectedFamilyId: familyId
		} as State);

		this.props.onChange(this.props.segment.number, familyId);
	}

	renderContent(): React.ReactNode {
		const { initialCombination, families, enabledFamilies } = this.props;
		const selectedFamilyId = this.state.selectedFamilyId || initialCombination;

		return <form className="fareFamilies-leg-segment__families">
			{families.map((family, index) => {
				const familyId = `F${index + 1}`;

				return <Family
					key={familyId}
					id={familyId}
					onChange={this.onChange}
					family={family}
					isDisabled={!enabledFamilies.hasOwnProperty(familyId)}
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
