<template>
	<div class="clients-list flex flex-col gap-4">
		<div>
			<h1 class="m-0 text-2xl text-slate-800" data-testid="clients-page-title">
			{{ t('clientsList.title') }}
		</h1>
		</div>

		<div class="bg-white rounded-lg p-4 shadow-sm">
			<div class="flex gap-4 items-center flex-nowrap">
				<div class="flex-1 min-w-[220px] flex items-center">
					<span class="p-input-icon-left flex w-full items-center">
						<InputText
							v-model="searchValue"
							:placeholder="t('clientsList.searchPlaceholder')"
							class="w-full p-2"
							data-testid="client-search"
						/>
					</span>
				</div>
				<Dropdown
					v-model="statusFilter"
					:options="statusOptions"
					option-label="label"
					option-value="value"
					:placeholder="t('clientsList.allStatuses')"
					class="min-w-[180px]"
				/>
			</div>
		</div>

		<div class="bg-white rounded-lg p-4 shadow-sm">
			<DataTable
				:value="filteredClients"
				:loading="store.loading"
				:paginator="true"
				:rows="10"
				:rows-per-page-options="[5, 10, 25, 50]"
				sort-mode="single"
				removable-sort
				data-key="id"
				striped-rows
				responsive-layout="scroll"
				class="p-datatable-sm"
				:current-page-report-template="t('clientsList.paginator')"
			>
				<template #empty>
					<div
						class="flex flex-col items-center justify-center py-12 px-4 text-slate-500"
					>
						<i class="pi pi-inbox text-5xl mb-4 opacity-50"></i>
						<p>{{ emptyMessage }}</p>
					</div>
				</template>
				<template #loading>
					<div
						class="flex flex-col items-center justify-center py-12 px-4 text-slate-500"
					>
						<ProgressSpinner
							style="width: 50px; height: 50px"
							stroke-width="4"
						/>
						<p>{{ t('clientsList.loading') }}</p>
					</div>
				</template>
				<Column field="name" :header="t('clientsList.columns.name')" sortable>
					<template #body="{ data }">
<router-link
								:to="`/clients/${data.id}/edit`"
								class="text-blue-600 no-underline hover:underline"
								:data-testid="`client-link-${data.id}`"
							>
							{{ data.name }}
						</router-link>
					</template>
				</Column>
				<Column field="email" :header="t('clientsList.columns.email')" sortable />
				<Column field="phone" :header="t('clientsList.columns.phone')" sortable />
				<Column field="status" :header="t('clientsList.columns.status')" sortable>
					<template #body="{ data }">
						<Tag
							:value="statusLabel(data.status)"
							:severity="statusSeverity(data.status)"
						/>
					</template>
				</Column>
				<Column :header="t('clientsList.columns.actions')" style="width: 120px">
					<template #body="{ data }">
						<div class="flex gap-1 items-center">
							<router-link
								:to="`/clients/${data.id}/edit`"
								class="btn-edit-icon"
								v-tooltip.top="t('clientsList.tooltips.edit')"
							>
								<i class="pi pi-pencil"></i>
							</router-link>
							<button
								type="button"
								class="btn-delete-icon"
								v-tooltip.top="t('clientsList.tooltips.delete')"
								:data-testid="`client-delete-${data.id}`"
								@click="confirmDelete(data)"
							>
								<i class="pi pi-trash"></i>
							</button>
						</div>
					</template>
				</Column>
			</DataTable>
		</div>

		<ConfirmDialog />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import ProgressSpinner from 'primevue/progressspinner';
import ConfirmDialog from 'primevue/confirmdialog';

import { useClientsStore } from '@/stores/clients';
import { debounce } from '@/utils/debounce';
import { loadFilters, saveFilters } from '@/utils/storageFilters';
import type { Client, ClientStatus } from '@/types';

const { t } = useI18n();
const store = useClientsStore();
const confirm = useConfirm();
const toast = useToast();

const statusOptions = computed(() => [
	{ label: t('status.all'), value: '' as const },
	{ label: t('status.new'), value: 'new' as const },
	{ label: t('status.active'), value: 'active' as const },
	{ label: t('status.blocked'), value: 'blocked' as const },
]);

const saved = loadFilters();
const searchValue = ref(saved.search);
const statusFilter = ref<ClientStatus | ''>(saved.status);

const persistFilters = (): void => {
	saveFilters({
		search: searchValue.value,
		status: statusFilter.value,
	});
};

const debouncedPersist = debounce(persistFilters, 400);

const filteredClients = computed(() => {
	let list = store.clients;
	const search = searchValue.value.trim().toLowerCase();
	const status = statusFilter.value;

	if (search) {
		list = list.filter(
			(c) =>
				c.name.toLowerCase().includes(search) ||
				c.email.toLowerCase().includes(search)
		);
	}
	if (status) {
		list = list.filter((c) => c.status === status);
	}
	return list;
});

const emptyMessage = computed(() => {
	if (store.loading) return '';
	if (store.clients.length === 0) return t('clientsList.emptyList');
	return t('clientsList.noResults');
});

const statusLabel = (status: ClientStatus): string => t(`status.${status}`);

const statusSeverity = (
	status: ClientStatus
): 'success' | 'info' | 'secondary' | 'warn' | 'danger' | 'contrast' => {
	const map: Record<ClientStatus, 'success' | 'info' | 'warn'> = {
		new: 'info',
		active: 'success',
		blocked: 'warn',
	};
	return map[status];
};

const confirmDelete = (client: Client): void => {
	confirm.require({
		message: t('clientsList.confirmDelete.message', { name: client.name }),
		header: t('clientsList.confirmDelete.header'),
		icon: 'pi pi-exclamation-triangle',
		rejectLabel: t('clientsList.confirmDelete.reject'),
		rejectClass: 'p-button-outlined p-button-secondary',
		acceptLabel: t('clientsList.confirmDelete.accept'),
		acceptClass: 'p-button-danger',
		accept: async () => {
			try {
				await store.deleteClient(client.id);
				toast.add({
					severity: 'success',
					summary: t('clientsList.toast.deleted'),
					detail: t('clientsList.toast.deletedDetail', { name: client.name }),
					life: 3000,
				});
			} catch {
				toast.add({
					severity: 'error',
					summary: t('clientsList.toast.error'),
					detail: t('clientsList.toast.deleteError'),
					life: 5000,
				});
			}
		},
	});
};

onMounted(async () => {
	await store.fetchClients();
	if (store.error) {
		toast.add({
			severity: 'error',
			summary: t('clientsList.toast.error'),
			detail: store.error,
			life: 5000,
		});
	}
});

watch([searchValue, statusFilter], debouncedPersist);
</script>

<style scoped>
	:deep(.p-inputtext),
	:deep(.p-dropdown) {
		box-shadow: 0 0 0 1px rgb(209 213 219);
	}
	:deep(.p-inputtext:focus),
	:deep(.p-dropdown:focus),
	:deep(.p-dropdown.p-focus) {
		box-shadow: 0 0 0 2px rgb(59 130 246);
	}
</style>
