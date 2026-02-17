import { createI18n } from 'vue-i18n';
import ru from '@/locales/ru';
import en from '@/locales/en';

const locale = localStorage.getItem('locale') ?? 'ru';

export const i18n = createI18n({
	legacy: false,
	locale,
	fallbackLocale: 'ru',
	messages: {
		ru,
		en,
	},
});
