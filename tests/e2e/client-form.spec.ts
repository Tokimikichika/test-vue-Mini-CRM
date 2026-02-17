import { test, expect } from '@playwright/test';

test.describe('Форма клиента', () => {
	test('создание нового клиента', async ({ page }) => {
		await page.goto('/clients/new');

		await expect(page.getByTestId('client-new-title')).toHaveText('Новый клиент');

		await page.getByTestId('client-name-input').fill('Тест Тестов');
		await page.getByLabel('Email *').fill('test@example.com');
		await page.getByLabel('Телефон *').fill('+7 (999) 111-22-33');
		await page.getByTestId('client-status-dropdown').click();
		await page.getByRole('option', { name: 'Активный' }).click();

		await page.getByRole('button', { name: 'Сохранить' }).click();

		await expect(page).toHaveURL('/clients');
		await expect(page.getByText('Тест Тестов')).toBeVisible({
			timeout: 5000,
		});
	});

	test('редактирование клиента', async ({ page }) => {
		await page.goto('/clients/1/edit');

		await expect(page.getByTestId('client-edit-title')).toHaveText(
			'Редактирование клиента'
		);

		const nameInput = page.getByTestId('client-name-input');
		await expect(nameInput).toHaveValue('Иван Петров', { timeout: 5000 });
		await nameInput.fill('Иван Петров (обновлён)');

		await page.getByRole('button', { name: 'Сохранить' }).click();

		await expect(page).toHaveURL('/clients');
		await expect(page.getByText('Иван Петров (обновлён)')).toBeVisible({
			timeout: 5000,
		});
	});

	test('валидация - пустые обязательные поля', async ({ page }) => {
		await page.goto('/clients/new');

		await page.getByRole('button', { name: 'Сохранить' }).click();

		await expect(page.getByText('Введите имя')).toBeVisible();
		await expect(page).toHaveURL('/clients/new');
	});

	test('кнопка Отмена возвращает к списку', async ({ page }) => {
		await page.goto('/clients/new');

		await page.getByRole('button', { name: 'Отмена' }).click();

		await expect(page).toHaveURL('/clients');
	});
});
