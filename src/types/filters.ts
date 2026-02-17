import type { ClientStatus } from './client';

export interface SavedFilters {
	search: string;
	status: ClientStatus | '';
}
