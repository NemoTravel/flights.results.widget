import blue from '../colors/blue';
import green from '../colors/green';
import yellow from '../colors/yellow';

type PaletteType = 'light' | 'dark';

export default {
	palette: {
		primary: blue,
		secondary: green,
		error: yellow,
		type: 'light' as PaletteType
	}
};
