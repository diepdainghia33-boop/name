import csv
import re
import os

def extract_md_tables(file_path):
    rows = []
    if not os.path.exists(file_path):
        return rows
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    for line in lines:
        if '|' in line and not re.match(r'^[|\-\s:]+$', line):
            parts = [p.strip() for p in line.split('|') if p.strip()]
            if len(parts) >= 3 and parts[0] != 'ID':
                rows.append(parts)
    return rows

def main():
    md_file = '../test_scenarios.md'
    output_file = '../test_report.csv'
    
    # 1. Lấy dữ liệu từ file markdown
    manual_tests = extract_md_tables(md_file)
    
    # 2. Dữ liệu các bài test tự động (Ghi nhận kết quả từ lần chạy gần nhất)
    automated_tests = [
        ['AUTO_PY_01', 'Kiểm tra Stats API (AI Service)', 'Trạng thái Stable, có cpu_speed', 'PASS'],
        ['AUTO_PY_02', 'Kiểm tra Analytics API (AI Service)', 'Trả về dữ liệu ngày và biểu đồ', 'PASS'],
        ['AUTO_PY_03', 'Kiểm tra Chat API (AI Service)', 'AI phản hồi đúng nội dung giả lập', 'PASS'],
        ['AUTO_PHP_01', 'Kiểm tra gửi tin nhắn (Backend)', 'Lưu DB và gọi AI thành công', 'PASS'],
        ['AUTO_PHP_02', 'Kiểm tra xóa hội thoại (Backend)', 'Xóa sạch dữ liệu trong database', 'PASS'],
        ['AUTO_PHP_03', 'Kiểm tra nhân bản hội thoại (Backend)', 'Tạo bản sao chính xác của chat cũ', 'PASS'],
    ]
    
    # 3. Xuất ra CSV với cột Trạng thái
    headers = ['ID', 'Tên kịch bản / Tính năng', 'Kết quả mong đợi', 'Loại kiểm thử', 'Trạng thái']
    
    with open(output_file, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        
        # Ghi các bài test thủ công
        for test in manual_tests:
            test_type = 'Integration' if test[0].startswith('INT') else 'Manual'
            writer.writerow([test[0], test[1], test[2], test_type, 'Pending (Manual Test Required)'])
            
        # Ghi các bài test tự động
        for test in automated_tests:
            writer.writerow([test[0], test[1], test[2], 'Automated', test[3]])
            
    # In thông báo an toàn (không dùng tiếng Việt có dấu ở print để tránh lỗi encoding console)
    print(f"Exported test report to: {os.path.abspath(output_file)}")

if __name__ == "__main__":
    main()
