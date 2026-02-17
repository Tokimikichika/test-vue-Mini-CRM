<template>
	<div class="client-form flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<router-link
				to="/clients"
				class="inline-flex items-center gap-2 text-slate-500 no-underline text-sm hover:text-blue-600"
			>
				<i class="pi pi-arrow-left"></i>
				{{ t('clientForm.back') }}
			</router-link>
			<h1
				class="m-0 text-2xl text-slate-800"
				:data-testid="isEdit ? 'client-edit-title' : 'client-new-title'"
			>
				{{ isEdit ? t('clientForm.editTitle') : t('clientForm.newTitle') }}
			</h1>
		</div>

		<div class="bg-white rounded-lg p-6 shadow-sm">
			<form @submit.prevent="handleSubmit" class="flex flex-col gap-5 max-w-md">
				<div>
					<label for="name" class="block mb-2 font-medium text-gray-700">
						{{ t('clientForm.labels.name') }} *
					</label>
					<InputText
						id="name"
						v-model="form.name"
						:class="{ 'p-invalid': errors.name }"
						class="w-full p-2"
						data-testid="client-name-input"
					/>
					<small v-if="errors.name" class="p-error">{{ errors.name }}</small>
				</div>

				<div>
					<label for="email" class="block mb-2 font-medium text-gray-700">
						{{ t('clientForm.labels.email') }} *
					</label>
					<InputText
						id="email"
						v-model="form.email"
						type="email"
						:class="{ 'p-invalid': errors.email }"
						class="w-full p-2"
						data-testid="client-email-input"
					/>
					<small v-if="errors.email" class="p-error">{{ errors.email }}</small>
				</div>

				<div>
					<label for="phone" class="block mb-2 font-medium text-gray-700">
						{{ t('clientForm.labels.phone') }} *
					</label>
					<InputText
						id="phone"
						v-model="form.phone"
						:class="{ 'p-invalid': errors.phone }"
						class="w-full p-2"
					/>
					<small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
				</div>

				<div>
					<label for="status" class="block mb-2 font-medium text-gray-700">
						{{ t('clientForm.labels.status') }} *
					</label>
					<Dropdown
						id="status"
						v-model="form.status"
						:options="statusOptions"
						option-label="label"
						option-value="value"
						:class="{ 'p-invalid': errors.status }"
						class="w-full"
						data-testid="client-status-dropdown"
					/>
					<small v-if="errors.status" class="p-error">{{
						errors.status
					}}</small>
				</div>

				<div class="flex gap-3 mt-2">
					<Button
						type="submit"
						:label="t('clientForm.buttons.save')"
						icon="pi pi-check"
						:loading="store.loading"
						:disabled="store.loading"
						data-testid="client-save-btn"
					/>
					<Button
						type="button"
						:label="t('clientForm.buttons.cancel')"
						icon="pi pi-times"
						severity="secondary"
						outlined
						@click="handleCancel"
					/>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';

import { useClientsStore } from '@/stores/clients';
import type { ClientFormData } from '@/types';

const props = defineProps<{
	id?: string;
}>();

const { t } = useI18n();
const router = useRouter();
const store = useClientsStore();
const toast = useToast();

const isEdit = computed(() => Boolean(props.id));

const statusOptions = computed(() => [
	{ label: t('status.new'), value: 'new' as const },
	{ label: t('status.active'), value: 'active' as const },
	{ label: t('status.blocked'), value: 'blocked' as const },
]);

const form = reactive<ClientFormData>({
	name: '',
	email: '',
	phone: '',
	status: 'new',
});

const errors = reactive<Record<keyof ClientFormData, string>>({
	name: '',
	email: '',
	phone: '',
	status: '',
});

const validate = (): boolean => {
	let valid = true;
	errors.name = '';
	errors.email = '';
	errors.phone = '';
	errors.status = '';

	if (!form.name.trim()) {
		errors.name = t('clientForm.errors.nameRequired');
		valid = false;
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!form.email.trim()) {
		errors.email = t('clientForm.errors.emailRequired');
		valid = false;
	} else if (!emailRegex.test(form.email)) {
		errors.email = t('clientForm.errors.emailInvalid');
		valid = false;
	}

	if (!form.phone.trim()) {
		errors.phone = t('clientForm.errors.phoneRequired');
		valid = false;
	}

	if (!form.status) {
		errors.status = t('clientForm.errors.statusRequired');
		valid = false;
	}

	return valid;
};

const handleSubmit = async (): Promise<void> => {
	if (!validate()) return;

	try {
		if (isEdit.value && props.id) {
			const id = Number(props.id);
			await store.updateClient(id, { ...form });
			toast.add({
				severity: 'success',
				summary: t('clientForm.toast.updated'),
				detail: t('clientForm.toast.updatedDetail'),
				life: 3000,
			});
		} else {
			await store.createClient({ ...form });
			toast.add({
				severity: 'success',
				summary: t('clientForm.toast.created'),
				detail: t('clientForm.toast.createdDetail'),
				life: 3000,
			});
		}
		await new Promise((r) => setTimeout(r, 150));
		router.push('/clients');
	} catch {
		toast.add({
			severity: 'error',
			summary: t('clientForm.toast.error'),
			detail: store.error ?? t('clientForm.toast.saveError'),
			life: 5000,
		});
	}
};

const handleCancel = (): void => {
	router.push('/clients');
};

onMounted(async () => {
	if (isEdit.value && props.id) {
		await store.fetchClients();
		const client = store.getClientById(Number(props.id));
		if (!client) {
			toast.add({
				severity: 'warn',
				summary: t('clientForm.toast.notFound'),
				detail: t('clientForm.toast.redirectToList'),
				life: 3000,
			});
			router.replace('/clients');
			return;
		}
		form.name = client.name;
		form.email = client.email;
		form.phone = client.phone;
		form.status = client.status;
	}
});
</script>

