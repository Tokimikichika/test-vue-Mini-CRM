import type { SavedFilters } from '@/types';

const STORAGE_KEY = 'mini-crm-filters';

const defaultFilters: SavedFilters = {
	search: '',
	status: '',
};

export function loadFilters(): SavedFilters {
	try {
		const data = localStorage.getItem(STORAGE_KEY);
		if (!data) return { ...defaultFilters };
		const parsed = JSON.parse(data) as Partial<SavedFilters>;
		return {
			search: String(parsed.search ?? ''),
			status: (parsed.status as SavedFilters['status']) ?? '',
		};
	} catch {
		return { ...defaultFilters };
	}
}

export function saveFilters(filters: SavedFilters): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
	} catch {
		// ignore
	}
}
