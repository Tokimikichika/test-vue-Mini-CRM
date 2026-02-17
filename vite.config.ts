import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	base: process.env.BASE_URL || '/',
	plugins: [vue()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['tests/unit/**/*.spec.ts'],
	},
});
