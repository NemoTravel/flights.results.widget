import { ApplicationState, SortingDirection, SortingState } from '../../state';
import Flight from '../../schemas/Flight';

export const getCurrentSorting = (state: ApplicationState): SortingState => state.sorting;

export const priceCompareFunction = (a: Flight, b: Flight, direction: SortingDirection): number => {
	if (a.totalPrice.amount > b.totalPrice.amount) {
		return direction === SortingDirection.ASC ? 1 : -1;
	}
	else if (a.totalPrice.amount < b.totalPrice.amount) {
		return direction === SortingDirection.ASC ? -1 : 1;
	}
	else {
		return 0;
	}
};
