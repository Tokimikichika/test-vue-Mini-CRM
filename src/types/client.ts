export type ClientStatus = 'new' | 'active' | 'blocked';

export interface Client {
	id: number;
	name: string;
	email: string;
	phone: string;
	status: ClientStatus;
	createAt: string;
}

export interface ClientFormData {
	name: string;
	email: string;
	phone: string;
	status: ClientStatus;
}
