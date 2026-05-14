# Kịch bản Kiểm thử (Test Scenarios)

Tài liệu này liệt kê các kịch bản kiểm thử cho các tính năng chính của hệ thống, bao gồm Frontend, Backend và AI Service.

## 1. Kiểm thử Đăng nhập & Xác thực (Auth)
| ID | Kịch bản | Mong đợi |
|:---|:---|:---|
| AUTH_01 | Đăng nhập với thông tin đúng | Đăng nhập thành công, chuyển hướng vào Dashboard. |
| AUTH_02 | Đăng nhập với mật khẩu sai | Hiển thị thông báo lỗi "Thông tin không chính xác". |
| AUTH_03 | Kiểm tra hết hạn Token | Sau khi token hết hạn, người dùng tự động bị đăng xuất. |

## 2. Kiểm thử Tính năng Chat (Core Feature)
| ID | Kịch bản | Mong đợi |
|:---|:---|:---|
| CHAT_01 | Gửi tin nhắn văn bản thông thường | Tin nhắn hiển thị trên UI, Backend lưu vào DB, nhận được phản hồi từ AI. |
| CHAT_02 | Gửi tin nhắn khi AI Service bị lỗi | Hiển thị thông báo lỗi "Dịch vụ AI hiện không khả dụng". |
| CHAT_03 | Kiểm tra lịch sử chat | Khi tải lại trang hoặc vào lại hội thoại cũ, các tin nhắn trước đó phải hiển thị đúng. |

## 3. Kiểm thử Quản lý API Key
| ID | Kịch bản | Mong đợi |
|:---|:---|:---|
| API_01 | Tạo API Key mới | Key mới xuất hiện trong danh sách, có thể sao chép được. |
| API_02 | Xóa API Key | Key bị xóa khỏi danh sách và không còn hiệu lực sử dụng. |

## 4. Kiểm thử Dashboard & Analytics
| ID | Kịch bản | Mong đợi |
|:---|:---|:---|
| DASH_01 | Hiển thị biểu đồ thống kê | Các biểu đồ (Analytics) hiển thị dữ liệu thực tế từ database. |
| DASH_02 | Kiểm tra tính realtime | Khi có tin nhắn mới, các con số thống kê trên Dashboard cập nhật (nếu có tính năng này). |

## 5. Kiểm thử Tích hợp (Integration)
| ID | Kịch bản | Mong đợi |
|:---|:---|:---|
| INT_01 | Backend gọi AI Service thành công | Log trên Backend cho thấy request đã gửi đến `ai_service` và nhận về mã 200. |
| INT_02 | Kiểm tra cấu hình .env | Thay đổi thông tin trong `.env` (Vd: API Key của OpenAI) và kiểm tra AI có hoạt động đúng theo key mới không. |

## 6. Kiểm thử Giao diện (UI/UX)
| ID | Kịch bản | Mong đợi |
|:---|:---|:---|
| UI_01 | Kiểm tra Responsive | Giao diện hiển thị tốt trên cả Mobile và Desktop. |
| UI_02 | Kiểm tra Dark/Light Mode | Chuyển đổi chế độ màu mượt mà, không bị lỗi font hay màu chữ khó đọc. |

---

## 🛠 Cách thực hiện kiểm thử thủ công
1.  Khởi động toàn bộ hệ thống bằng `start-all.bat`.
2.  Mở trình duyệt truy cập vào `localhost` của frontend.
3.  Thực hiện theo từng kịch bản (ID) trong bảng trên.
4.  Ghi lại kết quả (Pass/Fail) vào bảng theo dõi.
