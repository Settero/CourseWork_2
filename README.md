# CourseWork_2

Проект состоит из трех Docker-сервисов:

- `backend` - Django + Django REST Framework;
- `frontend` - React + Vite;
- `gateway` - Nginx, который отдает фронтенд и проксирует запросы к backend.

## Запуск через Docker

Перед запуском установите:

- Git;
- Docker;
- Docker Compose.

### 1. Скопировать проект

```bash
git clone <ссылка-на-репозиторий>
cd CourseWork_2
```

### 2. Создать файл окружения

Скопируйте пример переменных окружения:

```bash
cp .env.example .env
```

Для Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

При необходимости измените значения в `.env`.

### 3. Собрать и запустить контейнеры

```bash
docker compose up --build
```

При первом старте backend автоматически применит миграции и соберет статику.

После запуска проект будет доступен по адресу:

```text
http://localhost/
```

Админка Django:

```text
http://localhost/admin/
```

## Создание суперпользователя Django

Оставьте контейнеры запущенными и выполните в новом терминале:

```bash
docker compose exec backend python manage.py createsuperuser
```

Далее введите email, username, имя, фамилию и пароль по подсказкам Django.

Если база данных пустая, создайте суперпользователя до загрузки тестовых фикстур: тестовые события ссылаются на пользователя с `id=1`.

## Загрузка тестовых фикстур

Файл тестовых данных находится здесь:

```text
backend/config/events/fixtures/test_fixtures.json
```

Загрузить фикстуры можно командой:

```bash
docker compose exec backend python manage.py loaddata test_fixtures.json
```

Если данные уже загружались ранее, повторный импорт может завершиться ошибкой из-за уникальных полей. В таком случае используйте чистую базу или удалите конфликтующие записи через админку.

## Полезные команды

Запустить проект в фоне:

```bash
docker compose up -d --build
```

Посмотреть логи:

```bash
docker compose logs -f
```

Остановить контейнеры:

```bash
docker compose down
```

Остановить контейнеры и удалить данные PostgreSQL:

```bash
docker compose down -v
```
