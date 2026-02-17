import type { Client, ClientFormData } from '@/types';

const STORAGE_KEY = 'mini-crm-clients';

const generateId = (): number => Date.now() + Math.floor(Math.random() * 1000);

const getClients = (): Client[] => {
	const data = localStorage.getItem(STORAGE_KEY);
	if (!data) return [];
	try {
		return JSON.parse(data) as Client[];
	} catch {
		return [];
	}
};

const saveClients = (clients: Client[]): void => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
};

const initialClients: Client[] = [
	{
		id: 1,
		name: 'Иван Петров',
		email: 'ivan@example.com',
		phone: '+7 (999) 123-45-67',
		status: 'active',
		createAt: '2024-01-15T10:00:00Z',
	},
	{
		id: 2,
		name: 'Мария Сидорова',
		email: 'maria@example.com',
		phone: '+7 (999) 234-56-78',
		status: 'new',
		createAt: '2024-02-01T14:30:00Z',
	},
	{
		id: 3,
		name: 'Алексей Козлов',
		email: 'alexey@example.com',
		phone: '+7 (999) 345-67-89',
		status: 'blocked',
		createAt: '2024-01-20T09:15:00Z',
	},
];

const ensureInitialData = (): Client[] => {
	const clients = getClients();
	if (clients.length === 0) {
		saveClients(initialClients);
		return initialClients;
	}
	return clients;
};

const delay = (ms: number): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
	async fetchClients(): Promise<Client[]> {
		await delay(500);
		return ensureInitialData();
	},

	async createClient(data: ClientFormData): Promise<Client> {
		await delay(300);
		const clients = getClients();
		const client: Client = {
			...data,
			id: generateId(),
			createAt: new Date().toISOString(),
		};
		clients.push(client);
		saveClients(clients);
		return client;
	},

	async updateClient(id: number, data: ClientFormData): Promise<Client> {
		await delay(300);
		const clients = getClients();
		const index = clients.findIndex((c) => c.id === id);
		if (index === -1) {
			throw new Error(`Клиент с id ${id} не найден`);
		}
		const client: Client = {
			...clients[index],
			...data,
			id,
		};
		clients[index] = client;
		saveClients(clients);
		return client;
	},

	async deleteClient(id: number): Promise<void> {
		await delay(300);
		const clients = getClients();
		const filtered = clients.filter((c) => c.id !== id);
		if (filtered.length === clients.length) {
			throw new Error(`Клиент с id ${id} не найден`);
		}
		saveClients(filtered);
	},
};
