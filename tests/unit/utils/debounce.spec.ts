import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '@/utils/debounce';

describe('debounce', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('calls fn after delay', () => {
		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced();
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('passes arguments to fn', () => {
		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced('a', 1);
		vi.advanceTimersByTime(100);

		expect(fn).toHaveBeenCalledWith('a', 1);
	});

	it('cancels previous call on rapid invocations', () => {
		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced();
		debounced();
		debounced();
		vi.advanceTimersByTime(50);
		debounced();
		vi.advanceTimersByTime(100);

		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('calls fn with latest args after debounce period', () => {
		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced('first');
		debounced('second');
		debounced('third');
		vi.advanceTimersByTime(100);

		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith('third');
	});
});
