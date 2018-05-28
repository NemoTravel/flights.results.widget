import * as React from 'react';

import Family from './Family';
import FareFamily from '../../schemas/FareFamily';
import SegmentModel from '../../schemas/Segment';
import Money from '../../schemas/Money';

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
			this.props.initialCombination !== nextProps.initialCombination || true;
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
		const { isAvailable } = this.props;

		return <div className="fareFamilies-leg-segment">
			{!isAvailable ? (
				<div className="fareFamilies-leg-segment-title">
					<span className="fareFamilies-leg-segment-title__disclaimer">Выбор тарифа недоступен</span>
				</div>
			) : null}

			{isAvailable ? this.renderContent() : ''}
		</div>;
	}
}

export default Segment;
