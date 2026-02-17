import { defineStore } from 'pinia';
import { ref } from 'vue';
import { mockApi } from '@/api/mockApi';
import { i18n } from '@/i18n';
import type { Client, ClientFormData } from '@/types';

export const useClientsStore = defineStore('clients', () => {
	const clients = ref<Client[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const setError = (message: string | null): void => {
		error.value = message;
	};

	const fetchClients = async (): Promise<void> => {
		loading.value = true;
		error.value = null;
		try {
			clients.value = await mockApi.fetchClients();
		} catch (e) {
			const msg =
				e instanceof Error ? e.message : i18n.global.t('errors.loadClients');
			error.value = msg;
			clients.value = [];
		} finally {
			loading.value = false;
		}
	};

	const createClient = async (data: ClientFormData): Promise<Client> => {
		loading.value = true;
		error.value = null;
		try {
			const client = await mockApi.createClient(data);
			clients.value = [...clients.value, client];
			return client;
		} catch (e) {
			const msg =
				e instanceof Error ? e.message : i18n.global.t('errors.createClient');
			error.value = msg;
			throw e;
		} finally {
			loading.value = false;
		}
	};

	const updateClient = async (
		id: number,
		data: ClientFormData
	): Promise<Client> => {
		loading.value = true;
		error.value = null;
		try {
			const client = await mockApi.updateClient(id, data);
			const index = clients.value.findIndex((c) => c.id === id);
			if (index !== -1) {
				clients.value = clients.value.with(index, client);
			}
			return client;
		} catch (e) {
			const msg =
				e instanceof Error ? e.message : i18n.global.t('errors.updateClient');
			error.value = msg;
			throw e;
		} finally {
			loading.value = false;
		}
	};

	const deleteClient = async (id: number): Promise<void> => {
		loading.value = true;
		error.value = null;
		try {
			await mockApi.deleteClient(id);
			clients.value = clients.value.filter((c) => c.id !== id);
		} catch (e) {
			const msg =
				e instanceof Error ? e.message : i18n.global.t('errors.deleteClient');
			error.value = msg;
			throw e;
		} finally {
			loading.value = false;
		}
	};

	const getClientById = (id: number): Client | undefined =>
		clients.value.find((c) => c.id === id);

	return {
		clients,
		loading,
		error,
		setError,
		fetchClients,
		createClient,
		updateClient,
		deleteClient,
		getClientById,
	};
});
