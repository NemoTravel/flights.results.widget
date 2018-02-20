export enum FeaturePayment {
	Free = 'Free',
	Charge = 'Charge',
	NotAvailable = 'NotAvailable'
}

export default interface TariffFeature {
	description: string;
	name: string;
	needToPay: FeaturePayment;
	priority: number;
	showTitle: boolean;
	title: string;
	value: string;
}