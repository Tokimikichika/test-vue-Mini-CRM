import { test, expect } from '@playwright/test';

test.describe('Список клиентов', () => {
	test('отображает заголовок и список клиентов после загрузки', async ({
		page,
	}) => {
		await page.goto('/clients');

		await expect(page.getByTestId('clients-page-title')).toHaveText('Клиенты');

		await page.waitForSelector('[data-testid="client-link-1"]', {
			timeout: 10000,
		});

		await expect(page.getByTestId('client-link-1')).toHaveText('Иван Петров');
		await expect(page.getByTestId('client-link-2')).toHaveText('Мария Сидорова');
	});

	test('поиск фильтрует список', async ({ page }) => {
		await page.goto('/clients');

		await page.waitForSelector('[data-testid="client-link-1"]', {
			timeout: 10000,
		});

		await page.getByTestId('client-search').fill('Иван');

		await expect(page.getByTestId('client-link-1')).toBeVisible();
		await expect(page.getByTestId('client-link-2')).not.toBeVisible();
	});

	test('переход на редактирование по клику на имя', async ({ page }) => {
		await page.goto('/clients');

		await page.waitForSelector('[data-testid="client-link-1"]', {
			timeout: 10000,
		});

		await page.getByTestId('client-link-1').click();

		await expect(page).toHaveURL(/\/clients\/1\/edit/);
		await expect(page.getByTestId('client-edit-title')).toHaveText(
			'Редактирование клиента'
		);
	});
});
