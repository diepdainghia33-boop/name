# Architect AI Platform

Chào mừng bạn đến với **Architect AI Platform** - Một nền tảng hiện đại tích hợp AI với giao diện người dùng cao cấp. Dự án này bao gồm một Backend được xây dựng bằng Laravel và Frontend được xây dựng bằng React.

## 🚀 Cách Chạy Toàn Bộ Chương Trình

Bạn có hai cách để chạy dự án này: Sử dụng Docker (Khuyên dùng) hoặc chạy thủ công.

---

### 🐳 Cách 1: Sử Dụng Docker (Khuyên dùng)

Đây là cách nhanh nhất và đảm bảo môi trường đồng nhất.

> [!TIP]
> **Xem hướng dẫn chi tiết về Docker tại đây: [DOCKER_GUIDE.md](./DOCKER_GUIDE.md)**

1.  **Yêu cầu:** Đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2.  **Khởi chạy:** Mở terminal tại thư mục gốc của dự án và chạy lệnh sau:
    ```bash
    docker-compose up --build
    ```
3.  **Truy cập:**
    *   **Frontend:** [http://localhost:3000](http://localhost:3000)
    *   **Backend API:** [http://localhost:8000](http://localhost:8000)
    *   **MySQL:** Port `3307` (Root password: `root_password`)

---

### 🛠️ Cách 2: Cài Đặt Thủ Công

Nếu bạn không sử dụng Docker, hãy làm theo các bước sau:

#### 1. Cấu Hình Cơ Sở Dữ Liệu
*   Sử dụng XAMPP hoặc MySQL Server.
*   Tạo một database mới có tên là `laravel` (hoặc tùy chọn theo ý bạn).

#### 2. Cài Đặt Backend (Laravel)
1.  Di chuyển vào thư mục Backend:
    ```bash
    cd BackEnd
    ```
2.  Cài đặt các gói phụ thuộc:
    ```bash
    composer install
    ```
3.  Tạo file `.env` từ file mẫu:
    ```bash
    cp .env.example .env
    ```
4.  Cấu hình database trong file `.env`:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=laravel
    DB_USERNAME=root
    DB_PASSWORD=
    ```
5.  Tạo key cho ứng dụng và chạy migration:
    ```bash
    php artisan key:generate
    php artisan migrate
    ```
6.  Khởi chạy server:
    ```bash
    php artisan serve
    ```
    *Backend sẽ chạy tại: [http://127.0.0.1:8000](http://127.0.0.1:8000)*

#### 3. Cài Đặt Frontend (React)
1.  Di chuyển vào thư mục Frontend:
    ```bash
    cd ../frontend
    ```
2.  Cài đặt các thư viện:
    ```bash
    npm install
    ```
3.  Kiểm tra file `.env` để đảm bảo nó trỏ đúng về Backend API:
    ```env
    REACT_APP_API_URL=http://127.0.0.1:8000/api
    ```
4.  Khởi chạy ứng dụng:
    ```bash
    npm start
    ```
    *Frontend sẽ chạy tại: [http://localhost:3000](http://localhost:3000)*

---

## ✨ Các Tính Năng Chính
*   **Hệ thống xác thực:** Đăng ký, đăng nhập và xác thực qua Email (Gmail SMTP).
*   **Giao diện hiện đại:** Sử dụng Tailwind CSS và Framer Motion cho các hiệu ứng mượt mà.
*   **Tích hợp AI:** Các module hỗ trợ phân tích và chat thông minh.
*   **Quản lý Real-time:** Dashboard hiển thị dữ liệu trực quan.

## 📁 Cấu Trúc Thư Mục
*   `/BackEnd`: Mã nguồn Laravel (PHP).
*   `/frontend`: Mã nguồn React (JavaScript).
*   `docker-compose.yml`: Cấu hình container hóa ứng dụng.

## 📝 Lưu Ý
*   Đảm bảo bạn đã cài đặt **PHP >= 8.1**, **Composer**, và **Node.js >= 18**.
*   Nếu chạy Docker trên Windows, hãy chắc chắn Docker Desktop đang hoạt động.

---
*Chúc bạn có trải nghiệm tuyệt vời với Architect AI Platform!*
