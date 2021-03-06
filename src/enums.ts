export enum ScreenMaxSize {
	LaptopLarge = 1440,
	Laptop = 1100,
	Tablet = 768,
	Phone = 515
}

export enum Language {
	Russian = 'ru',
	English = 'en'
}

export enum PassengerType {
	Adult = 'ADT',
	Child = 'CLD',
	Infant = 'INF',
	InfantWithSeat = 'INS'
}

export enum Currency {
	RUB = 'RUB',
	USD = 'USD',
	GBP = 'GBP',
	EUR = 'EUR',
	CNY = 'CNY',
	LVL = 'LVL',
	UAH = 'UAH',
	CZK = 'CZK',
	JPY = 'JPY'
}

export enum CurrencyCode {
	RUB = '₽',
	USD = '$',
	GBP = '£',
	EUR = '€',
	CNY = 'CNY',
	LVL = 'LVL',
	UAH = '₴',
	CZK = 'CZK',
	JPY = '¥'
}

export enum LocationType {
	Departure = 'departure',
	Arrival = 'arrival'
}

export enum RouteType {
	OW = 'OW',
	RT = 'RT',
	CR = 'CR'
}

export enum SortingType {
	DepartureTime = 'DepartureTime',
	ArrivalTime = 'ArrivalTime',
	FlightTime = 'FlightTime',
	Price = 'Price'
}

export enum SortingDirection {
	ASC = 'ASC',
	DESC = 'DESC'
}

export enum FlightTimeInterval {
	Night = '00:00-06:00',
	Morning = '06:00-12:00',
	Afternoon = '12:00-18:00',
	Evening = '18:00-00:00'
}

export enum Route {
	Initial,
	Results,
	ResultsWithIds
}
