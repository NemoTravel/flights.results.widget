import * as React from 'react';
import * as classnames from 'classnames';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import FareFamily from '../../schemas/FareFamily';
import Money from '../../schemas/Money';
import Price from '../Price';
import Features from './Features';
import autobind from 'autobind-decorator';
import { i18n } from '../../i18n';

interface Props {
	id: string;
	family: FareFamily;
	isSelected: boolean;
	isDisabled?: boolean;
	onChange: (familyId: string) => void;
	price: Money;
}

class Family extends React.Component<Props> {
	static defaultProps: Partial<Props> = {
		isDisabled: false
	};

	@autobind
	onChange(): void {
		if (!this.props.isDisabled) {
			this.props.onChange(this.props.id);
		}
	}

	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.id !== nextProps.id ||
			this.props.isSelected !== nextProps.isSelected ||
			this.props.price !== nextProps.price ||
			this.props.family !== nextProps.family;
	}

	renderPrice(): React.ReactNode {
		const { isDisabled, isSelected, price } = this.props;
		let result = null;

		if (isDisabled || !price) {
			result = i18n('fareFamilies-family-selection__title');
		}
		else if (isSelected) {
			result = null;
		}
		else {
			result = <Price withPlus={price && price.amount > 0} withMinus={price && price.amount < 0} price={price}/>;
		}

		return result;
	}

	render(): React.ReactNode {
		const { family, isDisabled, isSelected, price } = this.props;

		return (
			<Card
				raised={isSelected}
				className={classnames('fareFamilies-leg-segment-family', {
					'fareFamilies-leg-segment-family_disabled': isDisabled,
					'fareFamilies-leg-segment-family_notAvailable': !price,
					'fareFamilies-leg-segment-family_selected': isSelected
				})}
			>
				<CardContent>
					<Typography gutterBottom variant="headline" component="h2">
						{family.fareFamilyName}
					</Typography>

					<Features features={[
						...family.fareFeatures.baggage,
						...family.fareFeatures.exare,
						...family.fareFeatures.misc
					]}/>
				</CardContent>

				<CardActions className="fareFamilies-leg-segment-family__actions">
					{isSelected ? (
						<div className="fareFamilies-leg-segment-family__actions-placeholder">{i18n('fareFamilies-family-selection__title_selected')}</div>
					) : (
						<Button variant="outlined" color="secondary" onClick={this.onChange}>
							{this.renderPrice()}
						</Button>
					)}
				</CardActions>
			</Card>
		);
	}
}

export default Family;
