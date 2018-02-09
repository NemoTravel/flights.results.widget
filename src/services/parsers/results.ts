import * as APIParser from '@nemo.travel/api-parser';

export const parse = (response: APIParser.Response): any => {
	return APIParser(response);
};
