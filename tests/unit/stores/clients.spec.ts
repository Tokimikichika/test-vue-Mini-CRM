import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useClientsStore } from '@/stores/clients';
import type { ClientFormData } from '@/types';

vi.mock('@/api/mockApi', () => ({
	mockApi: {
		fetchClients: vi.fn(),
		createClient: vi.fn(),
		updateClient: vi.fn(),
		deleteClient: vi.fn(),
	},
}));

import { mockApi } from '@/api/mockApi';

describe('clients store', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	describe('fetchClients', () => {
		it('loads clients and clears loading state', async () => {
			const clients = [
				{
					id: 1,
					name: 'Test',
					email: 'a@b.com',
					phone: '+7 999',
					status: 'active' as const,
					createAt: '2024-01-01',
				},
			];
			vi.mocked(mockApi.fetchClients).mockResolvedValue(clients);

			const store = useClientsStore();
			await store.fetchClients();

			expect(store.clients).toEqual(clients);
			expect(store.loading).toBe(false);
			expect(store.error).toBe(null);
		});

		it('sets error on fetch failure', async () => {
			vi.mocked(mockApi.fetchClients).mockRejectedValue(new Error('Network error'));

			const store = useClientsStore();
			await store.fetchClients();

			expect(store.clients).toEqual([]);
			expect(store.error).toBe('Network error');
			expect(store.loading).toBe(false);
		});
	});

	describe('createClient', () => {
		it('adds client and returns it', async () => {
			const data: ClientFormData = {
				name: 'New Client',
				email: 'new@test.com',
				phone: '+7 999',
				status: 'new',
			};
			const created = {
				...data,
				id: 100,
				createAt: '2024-01-01T00:00:00Z',
			};
			vi.mocked(mockApi.createClient).mockResolvedValue(created);

			const store = useClientsStore();
			store.clients = [];

			const result = await store.createClient(data);

			expect(result).toEqual(created);
			expect(store.clients).toHaveLength(1);
			expect(store.clients[0]).toEqual(created);
		});

		it('throws and sets error on failure', async () => {
			vi.mocked(mockApi.createClient).mockRejectedValue(
				new Error('Creation failed')
			);

			const store = useClientsStore();
			const data: ClientFormData = {
				name: 'X',
				email: 'x@x.com',
				phone: '1',
				status: 'active',
			};

			await expect(store.createClient(data)).rejects.toThrow('Creation failed');
			expect(store.error).toBe('Creation failed');
		});
	});

	describe('updateClient', () => {
		it('updates client in list', async () => {
			const existing = {
				id: 1,
				name: 'Old',
				email: 'old@test.com',
				phone: '1',
				status: 'active' as const,
				createAt: '2024-01-01',
			};
			const updated = {
				...existing,
				name: 'Updated',
				email: 'updated@test.com',
			};
			vi.mocked(mockApi.updateClient).mockResolvedValue(updated);

			const store = useClientsStore();
			store.clients = [existing];

			const result = await store.updateClient(1, {
				name: 'Updated',
				email: 'updated@test.com',
				phone: '1',
				status: 'active',
			});

			expect(result).toEqual(updated);
			expect(store.clients[0].name).toBe('Updated');
		});

		it('throws on non-existent client', async () => {
			vi.mocked(mockApi.updateClient).mockRejectedValue(
				new Error('Клиент с id 999 не найден')
			);

			const store = useClientsStore();
			const data: ClientFormData = {
				name: 'X',
				email: 'x@x.com',
				phone: '1',
				status: 'active',
			};

			await expect(store.updateClient(999, data)).rejects.toThrow();
			expect(store.error).toBe('Клиент с id 999 не найден');
		});
	});

	describe('deleteClient', () => {
		it('removes client from list', async () => {
			vi.mocked(mockApi.deleteClient).mockResolvedValue(undefined);

			const store = useClientsStore();
			store.clients = [
				{
					id: 1,
					name: 'A',
					email: 'a@a.com',
					phone: '1',
					status: 'active' as const,
					createAt: '2024-01-01',
				},
			];

			await store.deleteClient(1);

			expect(store.clients).toHaveLength(0);
		});

		it('throws on non-existent client', async () => {
			vi.mocked(mockApi.deleteClient).mockRejectedValue(
				new Error('Клиент с id 999 не найден')
			);

			const store = useClientsStore();

			await expect(store.deleteClient(999)).rejects.toThrow();
			expect(store.error).toBe('Клиент с id 999 не найден');
		});
	});

	describe('getClientById', () => {
		it('returns client by id', () => {
			const client = {
				id: 5,
				name: 'Test',
				email: 't@t.com',
				phone: '1',
				status: 'blocked' as const,
				createAt: '2024-01-01',
			};
			const store = useClientsStore();
			store.clients = [client];

			expect(store.getClientById(5)).toEqual(client);
		});

		it('returns undefined when not found', () => {
			const store = useClientsStore();
			store.clients = [];

			expect(store.getClientById(1)).toBeUndefined();
		});
	});
});
