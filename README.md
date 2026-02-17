# Mini CRM — управление клиентами

Упрощённая CRM для управления клиентами. Тестовое задание на умение работать с SPA, архитектурой и типичным CRM-сценарием.

## Стек технологий

- **Vue 3** — Composition API, `<script setup>`
- **TypeScript** — без `any`
- **PrimeVue** — UI-компоненты (DataTable, формы, Toast, ConfirmDialog)
- **vue-i18n** — локализация (RU/EN)
- **Pinia** — хранилище состояния
- **Vue Router** — маршрутизация

## Как запустить

```bash
# Установка зависимостей
npm install

# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Просмотр продакшен-сборки
npm run preview

# Unit-тесты (Vitest)
npm run test

# Unit-тесты в режиме watch
npm run test:watch

# E2E-тесты (Playwright)
npm run test:e2e
```

После `npm run dev` приложение доступно по адресу: http://localhost:5173

## Архитектурные решения

1. **Состояние и API**
   - Pinia store инкапсулирует логику загрузки, создания, обновления и удаления клиентов
   - API вынесен в отдельный модуль `mockApi.ts` — можно заменить на реальный (например, json-server) без изменения store

2. **Роутинг**
   - `/clients` — список клиентов
   - `/clients/new` — создание клиента
   - `/clients/:id/edit` — редактирование
   - Маршрут `/clients/new` объявлен выше `/clients/:id/edit`, чтобы слово "new" не трактовалось как id

3. **Фильтры**
   - Debounce 400ms для минимизации перерисовок при вводе
   - Фильтры сохраняются в localStorage — при повторном заходе пользователь видит те же настройки

4. **UX**
   - Toast-уведомления (PrimeVue Toast) при успехе и ошибках
   - Подтверждение удаления через ConfirmDialog
   - Состояния загрузки и пустого списка отображаются явно

5. **Валидация**
   - Проверка на стороне формы (обязательные поля, формат email)
   - Обработка ошибок API с отображением через Toast

6. **i18n**
   - Все тексты вынесены в `src/locales/` (ru, en)
   - Выбор языка (RU/EN) в навбаре, сохраняется в localStorage

## Подключение реального API (json-server)

1. Установить json-server: `npm i -D json-server`
2. Создать `db.json` с полем `clients`
3. Добавить скрипт: `"json-server": "json-server --watch db.json --port 3000"`
4. Заменить в `src/api/mockApi.ts` вызовы на `fetch('http://localhost:3000/clients', ...)` или создать отдельный модуль `realApi.ts`

## Что бы улучшил при большем времени

- **Composables**: вынести логику фильтрации и валидации в `useClientFilters`, `useClientForm`
- **Серверная пагинация/поиск**: при большом объёме данных — API с query-параметрами
- **Офлайн/оптимистичные обновления**: моментальное отображение изменений до ответа API
- **Компоненты**: разбить ClientsList на ClientTable, ClientFilters, ClientActions

