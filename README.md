# CourseWork_2

В проекте есть две части:

- `backend` - Django + Django REST Framework;
- `frontend` - React + Vite.

## Установка на новом устройстве

Перед началом установите:

- Git;
- Python 3.12 или новее;
- Node.js и npm.

### 1. Скопировать проект

```bash
git clone <ссылка-на-репозиторий>
cd CourseWork_2
```

### 2. Настроить backend

Перейдите в папку с Django-проектом:

```bash
cd backend
```

Создайте и активируйте виртуальное окружение.

Windows PowerShell:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Linux / macOS:

```bash
python3 -m venv venv
source venv/bin/activate
```

Установите зависимости:

```bash
pip install -r requirements.txt
```

Перейдите в папку с `manage.py`:

```bash
cd config
```

Создайте базу данных и примените миграции:

```bash
python manage.py migrate
```

При необходимости создайте администратора:

```bash
python manage.py createsuperuser
```

Запустите backend:

```bash
python manage.py runserver
```

Backend будет доступен по адресу:

```text
http://127.0.0.1:8000/
```

### 3. Настроить frontend

Откройте второй терминал и перейдите в папку фронтенда:

```bash
cd frontend
```

Установите зависимости:

```bash
npm install
```

Если используется переменная окружения для адреса API, создайте файл `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Запустите frontend:

```bash
npm run dev
```

Frontend будет доступен по адресу, который покажет Vite, обычно:

```text
http://localhost:5173/
```

## Повторный запуск проекта

Backend:

```bash
cd backend
.\venv\Scripts\Activate.ps1
cd config
python manage.py runserver
```

Frontend:

```bash
cd frontend
npm run dev
```