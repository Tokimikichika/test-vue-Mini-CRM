import { test, expect } from '@playwright/test';

test.describe('Удаление клиента', () => {
	test('удаление с подтверждением', async ({ page }) => {
		await page.goto('/clients');

		await page.waitForSelector('[data-testid="client-link-3"]', {
			timeout: 10000,
		});

		await page.getByTestId('client-delete-3').click();

		await expect(page.getByText('Подтверждение удаления')).toBeVisible({
			timeout: 5000,
		});
		await page.getByRole('button', { name: 'Удалить' }).click();

		await expect(page.getByTestId('client-link-3')).not.toBeVisible({
			timeout: 5000,
		});
	});

	test('отмена удаления оставляет клиента в списке', async ({ page }) => {
		await page.goto('/clients');

		await page.waitForSelector('[data-testid="client-delete-2"]', {
			timeout: 10000,
		});

		await page.getByTestId('client-delete-2').click();

		await expect(page.getByText('Подтверждение удаления')).toBeVisible({
			timeout: 5000,
		});
		await page.getByRole('button', { name: 'Отмена' }).click();

		await expect(page.getByTestId('client-link-2')).toBeVisible();
	});
});
