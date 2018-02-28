export enum FeaturePayment {
	Free = 'Free',
	Charge = 'Charge',
	NotAvailable = 'NotAvailable'
}

export enum FeatureCode {
	DESCRIPTION = 'description',
	CARRY_ON = 'carry_on',
	BAGGAGE = 'baggage',
	SEATS_REGISTRATION = 'seats_registration',
	VIP_SERVICES = 'vip_service',
	MILES = 'miles',
	MEAL = 'meal',
	REFUNDABLE = 'refundable',
	EXCHANGEABLE = 'exchangeable'
}

export default interface FareFamilyFeature {
	description: string;
	name: FeatureCode;
	needToPay: FeaturePayment;
	priority: number;
	showTitle: boolean;
	title: string;
	value: string;
}
