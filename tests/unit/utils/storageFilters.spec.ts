import { describe, it, expect, beforeEach } from 'vitest';
import { loadFilters, saveFilters } from '@/utils/storageFilters';

const STORAGE_KEY = 'mini-crm-filters';

describe('storageFilters', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	describe('loadFilters', () => {
		it('returns default filters when storage is empty', () => {
			const result = loadFilters();
			expect(result).toEqual({ search: '', status: '' });
		});

		it('returns saved filters from localStorage', () => {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({ search: 'test', status: 'active' })
			);
			const result = loadFilters();
			expect(result).toEqual({ search: 'test', status: 'active' });
		});

		it('returns default filters on invalid JSON', () => {
			localStorage.setItem(STORAGE_KEY, 'invalid json');
			const result = loadFilters();
			expect(result).toEqual({ search: '', status: '' });
		});

		it('handles partial saved data', () => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({ search: 'q' }));
			const result = loadFilters();
			expect(result.search).toBe('q');
			expect(result.status).toBe('');
		});
	});

	describe('saveFilters', () => {
		it('saves filters to localStorage', () => {
			saveFilters({ search: 'query', status: 'new' });
			const stored = localStorage.getItem(STORAGE_KEY);
			expect(stored).toBe(JSON.stringify({ search: 'query', status: 'new' }));
		});

		it('overwrites previous filters', () => {
			saveFilters({ search: 'old', status: '' });
			saveFilters({ search: 'new', status: 'blocked' });
			const result = loadFilters();
			expect(result).toEqual({ search: 'new', status: 'blocked' });
		});
	});
});
