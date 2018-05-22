import { SortingDirection, SortingType } from '../../enums';

export const SET_SORTING = 'SET_SORTING';

export type SortingAction = ReturnType<typeof setSorting>;

export const setSorting = (type: SortingType, direction: SortingDirection) => {
	return {
		type: SET_SORTING,
		payload: {
			type,
			direction
		}
	};
};
