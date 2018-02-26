import * as React from 'react';
import Typography from 'material-ui/Typography';

import Family from './Family';
import { SelectedFamiliesAction } from '../../store/alternativeFlights/selectedFamilies/actions';

interface Props {
	segmentId: number;
	selectFamily: (segmentId: number, familyId: number) => SelectedFamiliesAction;
	selectedFamilyId: number;
}

export interface FamilyModel {
	id: number;
	name: string;
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
		const { selectedFamilyId } = this.props;
		const families: FamilyModel[] = [
			{
				id: 0,
				name: 'Легкий'
			},
			{
				id: 1,
				name: 'Стандарт'
			},
			{
				id: 2,
				name: 'Премиум'
			}
		];

		return <div className="fareFamilies-leg-segment">
			<Typography className="fareFamilies-leg-segment__title" variant="headline">
				Саратов &mdash; Москва, 24 июня
			</Typography>

			<form className="fareFamilies-leg-segment__families">
				{families.map(family => <Family
					key={family.id}
					selectFamily={this.selectFamilyWrapper}
					family={family}
					isSelected={selectedFamilyId === family.id}
				/>)}
			</form>
		</div>;
	}
}

export default Segment;
