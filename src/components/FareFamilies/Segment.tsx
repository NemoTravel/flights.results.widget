import * as React from 'react';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Tooltip from 'material-ui/Tooltip';

import Family from './Family';
import FareFamily from '../../schemas/FareFamily';
import SegmentModel from '../../schemas/Segment';
import Money from '../../schemas/Money';
import { fixImageURL } from '../../utils';

interface Props {
	enabledFamilies: { [familyId: string]: boolean };
	initialCombination: string;
	segment: SegmentModel;
	segmentId: string;
	onChange: (segmentId: number, familyId: string) => void;
	families: FareFamily[];
	isAvailable: boolean;
	prices: { [familyId: string]: Money };
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

	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.enabledFamilies !== nextProps.enabledFamilies ||
			this.props.prices !== nextProps.prices ||
			this.props.segment !== nextProps.segment ||
			this.props.segmentId !== nextProps.segmentId ||
			this.props.families !== nextProps.families ||
			this.props.isAvailable !== nextProps.isAvailable ||
			this.props.initialCombination !== nextProps.initialCombination;
	}

	onChange(familyId: string): void {
		this.setState({
			selectedFamilyId: familyId
		} as State);

		this.props.onChange(this.props.segment.number, familyId);
	}

	renderContent(): React.ReactNode {
		const { initialCombination, families, enabledFamilies, prices } = this.props;
		const selectedFamilyId = this.state.selectedFamilyId || initialCombination;

		return <form className="fareFamilies-leg-segment__families">
			{families ? families.map((family, index) => {
				const familyId = `F${index + 1}`;

				return enabledFamilies.hasOwnProperty(familyId) ? <Family
					key={familyId}
					id={familyId}
					onChange={this.onChange}
					family={family}
					isSelected={selectedFamilyId === familyId}
					price={prices ? prices[familyId] : null}
				/> : null;
			}) : null}
		</form>;
	}

	render(): React.ReactNode {
		const { isAvailable, segment } = this.props;

		return <Paper className="fareFamilies-leg-segment">
			<div className="fareFamilies-leg-segment-title">
				<div className="fareFamilies-leg-segment-title__left">
					<div className="fareFamilies-leg-segment-title-logo">
						<Tooltip title={segment.airline.name} placement="top">
							<img src={fixImageURL(segment.airline.logoIcon)}/>
						</Tooltip>
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
