<template>
	<div class="min-h-screen bg-gray-100">
		<nav class="flex gap-4 items-center px-6 py-4 bg-white shadow-sm">
			<router-link
				to="/clients"
				class="flex items-center gap-2 px-4 py-2 text-gray-600 no-underline rounded-md transition-colors hover:bg-gray-100 hover:text-blue-500"
			>
				<i class="pi pi-users"></i>
				{{ t('nav.clients') }}
			</router-link>
			<router-link
				to="/clients/new"
				class="flex items-center gap-2 px-4 py-2 text-gray-600 no-underline rounded-md transition-colors hover:bg-gray-100 hover:text-blue-500"
			>
				<i class="pi pi-plus"></i>
				{{ t('nav.newClient') }}
			</router-link>
			<div class="ml-auto flex gap-2">
				<button
					type="button"
					:class="[
						'px-2 py-1 rounded text-sm',
						locale === 'ru'
							? 'bg-blue-500 text-white'
							: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
					]"
					@click="setLocale('ru')"
				>
					RU
				</button>
				<button
					type="button"
					:class="[
						'px-2 py-1 rounded text-sm',
						locale === 'en'
							? 'bg-blue-500 text-white'
							: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
					]"
					@click="setLocale('en')"
				>
					EN
				</button>
			</div>
		</nav>
		<main class="p-6 max-w-6xl mx-auto">
			<router-view v-slot="{ Component }">
				<transition name="fade" mode="out-in">
					<component :is="Component" />
				</transition>
			</router-view>
		</main>
		<Toast position="top-right" />
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Toast from 'primevue/toast';

const { t, locale } = useI18n();

const setLocale = (l: 'ru' | 'en'): void => {
	locale.value = l;
	localStorage.setItem('locale', l);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
