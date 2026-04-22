# ChatID / Architect AI Platform

ChatID là một hệ thống chat AI + dashboard theo dõi hoạt động, gồm:

- Frontend React
- Backend Laravel
- AI service FastAPI
- MySQL và Redis

## Tính năng chính

- Đăng ký và đăng nhập
- Banner chào mừng sau khi đăng nhập
- Chat với AI, có hỗ trợ file, ảnh và tìm kiếm web
- Dashboard real data
- Analytics và biểu đồ xu hướng
- Ghi log hoạt động và notification

## Cấu trúc dự án

- `BackEnd/`: Laravel API
- `frontend/`: React UI
- `ai_service/`: FastAPI service
- `docker-compose.yml`: chạy toàn bộ stack bằng Docker
- `start-all.bat`: launcher Windows để mở cùng lúc frontend, backend và AI service

## Port mặc định

- Frontend: `http://localhost:3000`
- Backend: `http://127.0.0.1:8000`
- AI service: `http://127.0.0.1:8001`
- MySQL trong Docker: `3307`
- Redis: `6379`

## Yêu cầu môi trường

- PHP 8.2+
- Composer
- Node.js 18+
- Python 3.10+
- MySQL 8+ hoặc XAMPP
- Redis nếu dùng cấu hình hiện tại của backend
- Tesseract OCR nếu bạn dùng tính năng OCR ảnh
- Docker Desktop nếu chạy bằng Docker

## Chạy nhanh trên Windows

1. Chạy `start-all.bat` từ thư mục gốc dự án.
2. Nếu thiếu dependencies, cài trước:
```bash
cd BackEnd
composer install
cd ..\frontend
npm install
cd ..\ai_service
pip install -r requirements.txt
```
3. Mở các URL ở phần Port mặc định.

## Chạy bằng Docker

1. Bật Docker Desktop.
2. Chạy:
```bash
docker-compose up --build
```
3. Truy cập:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- AI service: `http://localhost:8001`

## Chạy thủ công

### 1. Backend Laravel

```bash
cd BackEnd
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

Cấu hình backend `.env` nên có:

```env
APP_URL=http://127.0.0.1:8000
AI_SERVICE_URL=http://127.0.0.1:8001
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

### 2. Frontend React

```bash
cd frontend
npm install
npm start
```

Cấu hình frontend `.env`:

```env
REACT_APP_API_URL=http://127.0.0.1:8000/api
REACT_APP_AI_SERVICE_URL=http://127.0.0.1:8001
```

### 3. AI service FastAPI

```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r ai_service\requirements.txt
cd ai_service
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

Cấu hình AI service `.env`:

```env
GROQ_API_KEY=your_groq_key
ANTHROPIC_API_KEY=your_anthropic_key
```

## Launcher Windows

Nếu bạn muốn bật toàn bộ app bằng một lệnh, chạy:

```bat
start-all.bat
```

Launcher này sẽ mở 3 cửa sổ riêng cho:

- Backend Laravel
- Frontend React
- AI service FastAPI

## Lưu ý

- Backend hiện đọc `AI_SERVICE_URL` và mặc định là `http://127.0.0.1:8001`.
- Frontend đọc `REACT_APP_API_URL` và `REACT_APP_AI_SERVICE_URL`.
- Nếu một port đang bị chiếm, hãy đổi port tương ứng trong file `.env` và script chạy.
- Nếu `Health Score`, `avg response time` hoặc `User Satisfaction` hiện `--`, nghĩa là chưa có đủ dữ liệu thật để tính.

## Lệnh hữu ích

- `start-all.bat`
- `CHAY_AI.bat`
- `docker-compose up --build`
- `npm run build` trong `frontend`
- `php artisan test` trong `BackEnd`
