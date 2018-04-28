/* global describe */
/* global it */
/* global expect */
import { addCodeInList, declension, removeCodeFromList, fixImageURL, REQUEST_URL } from '../utils';

describe('utils', () => {
	describe('addCodeInList', () => {
		it('should add new string to an array', () => {
			const list: string[] = ['code_1', 'code_2'];
			const newList = addCodeInList(list, 'code_3');

			expect(!!newList.find(value => value === 'code_3')).toEqual(true);
		});

		it('should not add duplicate string to an array', () => {
			const list: string[] = ['code_1', 'code_2'];
			const newList = addCodeInList(list, 'code_2');

			expect(newList.length).toEqual(list.length);
		});
	});

	describe('removeCodeFromList', () => {
		it('should remove string from an array', () => {
			const list: string[] = ['code_1', 'code_2'];
			const newList = removeCodeFromList(list, 'code_2');

			expect(newList.length).toEqual(list.length - 1);
		});
	});

	describe('fixImageURL', () => {
		it('should create valid URL without double slashes', () => {
			const expectedURL = `${REQUEST_URL}image.jpg`;

			expect(fixImageURL('image.jpg')).toEqual(expectedURL);
			expect(fixImageURL('/image.jpg')).toEqual(expectedURL);
		});
	});

	describe('declension', () => {
		it('should return `Москва`', () => {
			expect(declension('Москва')).toEqual('Москве');
		});

		it('should return `Казани`', () => {
			expect(declension('Казань')).toEqual('Казани');
		});

		it('should return `Клинцах`', () => {
			expect(declension('Клинцы')).toEqual('Клинцах');
		});
	});
});
