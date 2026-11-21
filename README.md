# Hệ Thống Khảo Thí & Ngân Hàng Đề Thi Chuyên Nghiệp (Edu Exam Studio Pro v2)

Bộ ứng dụng tạo đề thi, ngân hàng câu hỏi đa môn, xử lý công thức toán/lý/hóa chuẩn Bộ Giáo Dục & Đào Tạo, tích hợp chấm thi OMR tự động.

Phiên bản **v2** đã được nâng cấp toàn diện về giao diện và trải nghiệm thao tác người dùng theo chuẩn các phần mềm văn phòng chuyên nghiệp (Microsoft Word / Excel):

---

### Các Điểm Nâng Cấp Vượt Trội Ở Bản v2:

1. **Giao diện Giáo Dục Chuyên Nghiệp (Không còn nét AI thô sơ)**:
   - Thay thế toàn bộ màu sắc rực rỡ trước đây bằng bảng màu chuẩn Microsoft Office / Giáo dục: Xanh Navy đậm (`#1E3A8A`), xám nhạt (`#F8FAFC`), viền tinh tế và đổ bóng chuẩn mực.
   - Thẻ và các vùng câu hỏi hiển thị dạng trang giấy thi trang nhã, phông chữ Times New Roman / Segoe UI rõ ràng, trực quan.

2. **Thanh Công Cụ Ribbon Chuẩn Word**:
   - **Nhóm Lịch sử**: Nút ↶ **Hoàn tác (Undo)** và ↷ **Làm lại (Redo)**.
   - **Nhóm Phông chữ & Định dạng**: Lựa chọn Font chữ, cỡ chữ, nút **In đậm (B)**, **In nghiêng (I)**, **Gạch chân (U)**, **Gạch ngang (S)**, **Chỉ số dưới (X₂)**, **Chỉ số trên (X²)**, nút **Xóa định dạng (🧹)**.
   - **Nhóm Căn đoạn**: Căn trái, căn giữa, căn phải, căn đều 2 bên, tạo danh sách dấu chấm.
   - **Nhóm Chèn đối tượng**: Nút chèn Bảng chuẩn, Chèn ảnh, Chèn công thức LaTeX (∑), Chèn đồ thị dao động.
   - **Nhóm Bộ môn & Ký hiệu nhanh**: Toán, Vật lí, Hóa học, Ký hiệu nhanh.

3. **Công Cụ Tạo & Xử Lý Bảng Thông Minh**:
   - **Tạo bảng tùy chỉnh**: Mở hộp thoại chọn nhanh số dòng (1-50), số cột (1-20), tùy chọn dòng đầu làm Tiêu đề (Header).
   - **Dán trực tiếp từ Word / Excel**: Hỗ trợ bôi đen bảng trong Word hoặc chọn các ô trong Excel, bấm `Ctrl + C` và dán thẳng (`Ctrl + V`) vào nội dung câu hỏi. Hệ thống tự động chuyển đổi thành bảng giáo dục chuẩn mực, loại bỏ toàn bộ mã rác của Office.
   - **Nhập từ văn bản phân tách**: Có ô dán dữ liệu dạng tab/dấu phẩy để nạp nhanh thành bảng.

4. **Hệ Thống Phím Tắt Tiện Dụng**:
   - `Ctrl + Z`: Hoàn tác thao tác vừa thực hiện
   - `Ctrl + Y`: Làm lại thao tác vừa hoàn tác
   - `Ctrl + B`: Bật/tắt in đậm
   - `Ctrl + I`: Bật/tắt in nghiêng
   - `Ctrl + U`: Bật/tắt gạch chân
   - `Ctrl + V`: Dán văn bản, ảnh hoặc bảng từ Excel/Word
   - `Delete` / `Backspace`: Xóa hình ảnh / đối tượng đang được chọn
   - `Esc`: Đóng các hộp thoại hoặc hủy chọn hình ảnh

5. **Cấu Trúc Thư Mục Module Hóa**:
   - `index.html`: Khung sườn ứng dụng
   - `css/style.css`: Toàn bộ phong cách giao diện chuyên nghiệp
   - `assets/icons/`: Các icon hình ảnh (align, crop, rotate,...) để người dùng dễ thay thế
   - `js/`: 8 file chức năng riêng biệt (`state.js`, `storage.js`, `katex-mathml.js`, `prompt-studio.js`, `exam-export.js`, `omr-grading.js`, `image-studio.js`, `main.js`).

---
*Chỉ cần nhấp đúp vào `index.html` để khởi chạy ứng dụng ngay trên mọi trình duyệt web hiện đại mà không cần cài đặt thêm phần mềm.*
