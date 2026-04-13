# 🐳 Hướng Dẫn Chi Tiết Về Docker cho Architect AI Platform

Tài liệu này cung cấp cái nhìn chi tiết về cách Docker vận hành trong dự án này và cách bạn có thể làm chủ nó.

## 1. Tại sao dùng Docker?
Docker giúp "đóng gói" toàn bộ môi trường (PHP, MySQL, Node.js) vào các container. Điều này giúp dự án chạy giống hệt nhau trên máy của bạn, máy của đồng nghiệp hoặc trên server mà không gặp lỗi "máy tôi chạy được nhưng máy bạn thì không".

## 2. Các thành phần (Services) trong Docker
Dự án bao gồm 3 dịch vụ chính được định nghĩa trong `docker-compose.yml`:

### a. Dịch vụ Cơ sở dữ liệu (mysql)
*   **Image:** MySQL 8.0
*   **Cổng (Port):** `3307` trên máy bạn được nối với `3306` trong container.
*   **Dữ liệu:** Được lưu tại Volume `db-data` (không bị mất khi xóa container).
*   **Thông tin đăng nhập:**
    *   User: `architect_user`
    *   Password: `user_password`
    *   Database: `laravel`

### b. Dịch vụ Backend (backend)
*   **Môi trường:** PHP 8.2-fpm + Laravel.
*   **Cổng (Port):** `8000`.
*   **Cơ chế:** Thư mục `./BackEnd` trên máy bạn được "mount" vào `/var/www` trong container. Nghĩa là bạn sửa code ở ngoài, bên trong container sẽ cập nhật ngay lập tức.

### c. Dịch vụ Frontend (frontend)
*   **Môi trường:** Node.js 20.
*   **Cổng (Port):** `3000`.
*   **Cơ chế:** Thư mục `./frontend` được đồng bộ để hỗ trợ **Hot Reload** (sửa code web tự load lại).

---

## 3. Các lệnh Docker thường dùng (Cheatsheet)

### Khởi chạy dự án
```bash
# Chạy lần đầu hoặc khi có thay đổi Dockerfile/package.json
docker-compose up --build

# Chạy ở chế độ chạy ngầm (không hiện log ra terminal)
docker-compose up -d
```

### Dừng dự án
```bash
# Dừng các container nhưng giữ lại dữ liệu volume
docker-compose stop

# Dừng và xóa hoàn toàn các container (dữ liệu DB vẫn an toàn trong volume)
docker-compose down
```

### Xem Log (Để debug lỗi)
```bash
# Xem log của tất cả services
docker-compose logs -f

# Chỉ xem log của Backend
docker-compose logs -f backend

# Chỉ xem log của Frontend
docker-compose logs -f frontend
```

### Chạy lệnh Artisan bên trong Container
Bạn không cần cài PHP trên máy thật, hãy dùng lệnh này để chạy migration:
```bash
# Chạy migration
docker exec -it chatid-backend php artisan migrate

# Tạo controller mới
docker exec -it chatid-backend php artisan make:controller TenController
```

---

## 4. Xử lý lỗi thường gặp

### Lỗi 1: Cổng (Port) đã bị chiếm dụng
*   **Biểu hiện:** Docker báo lỗi `Bind for 0.0.0.0:8000 failed`.
*   **Khắc phục:** Đảm bảo bạn đã tắt XAMPP Apache hoặc các server khác đang chạy ở port 8000, 3000 hoặc 3307.

### Lỗi 2: Thay đổi .env không có tác dụng
*   **Khắc phục:** Sau khi sửa file `.env`, bạn nên khởi động lại container:
    ```bash
    docker-compose restart backend
    ```

### Lỗi 3: Lỗi kết nối Database
*   **Lưu ý:** Trong Docker, Laravel kết nối với DB qua tên máy chủ là `mysql` (định nghĩa trong docker-compose), không phải `127.0.0.1`.
*   Kiểm tra file `.env` của Backend trong Docker:
    ```env
    DB_HOST=mysql
    DB_PORT=3306
    ```

---

## 5. Quy trình làm việc hàng ngày với Docker
1.  Mở Docker Desktop.
2.  Mở Terminal tại thư mục dự án: `docker-compose up`.
3.  Code bình thường trên VS Code.
4.  Dùng `docker exec` để chạy các lệnh terminal nếu cần.
5.  Khi xong việc: `Ctrl + C` hoặc `docker-compose down`.
