import { createRouter, createWebHistory } from 'vue-router';
import ClientsList from '@/views/ClientsList.vue';
import ClientForm from '@/views/ClientForm.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: '/', redirect: '/clients' },
		{ path: '/clients', name: 'clients', component: ClientsList },
		{ path: '/clients/new', name: 'client-new', component: ClientForm },
		{
			path: '/clients/:id/edit',
			name: 'client-edit',
			component: ClientForm,
			props: true,
		},
	],
});

export default router;
