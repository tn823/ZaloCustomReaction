# ZaloCustomReaction Plus

Userscript 2.0.0 cho Zalo Web, phát triển từ ý tưởng và cơ chế `sendReaction` trong Zalo Custom Reaction 1.4.1 của Anh Duc Le (ducladev).

## Cài thử

1. Trong Tampermonkey, tắt userscript Zalo Custom Reaction cũ để tránh hai bản cùng sửa menu.
2. Tạo userscript mới, dán toàn bộ nội dung `dist/ZaloCustomReaction.user.js`, lưu lại.
3. Tải lại https://chat.zalo.me. Mở menu reaction của một tin nhắn rồi bấm ✨.
4. Chọn emoji để gửi một reaction; Shift + nhấp để thêm/bỏ yêu thích.

## Tính năng

- Hơn 350 emoji có sẵn, không tải dữ liệu từ CDN.
- Tìm theo emoji, nhóm hoặc từ khóa tiếng Việt không dấu/tiếng Anh. Tìm từ khóa theo nhóm, chưa có tên riêng cho từng emoji.
- Yêu thích và 32 reaction gần đây, lưu trong localStorage của trình duyệt.
- Nhập reaction riêng (tối đa 64 ký tự); mỗi lần chọn gửi một lần.
- Sáng/tối theo hệ thống, hỗ trợ màn hình nhỏ, Escape, giữ focus trong hộp thoại.
- CSS tách riêng bằng Shadow DOM, không thay style chung của Zalo.
- Theo dõi menu được thêm trực tiếp và menu có sẵn; không đợi tải dữ liệu mạng mới khởi động.

## Phát triển và xem thử

Không cần cài thư viện. Cần Node.js để chạy các lệnh:

```sh
npm run check
npm test
npm run build
```

Mở `preview.html` để thử giao diện và tìm kiếm ở chế độ không gửi reaction. Sửa `src/zalo-custom-reaction.js`, sau đó build lại trước khi cài.

## Giới hạn cần kiểm tra trên tài khoản thật

Zalo không cung cấp API công khai cho userscript này. Tích hợp dựa vào selector `.reaction-emoji-list` và React fiber có callback `sendReaction`, có thể thay đổi theo bản Zalo. Script báo lỗi nếu không tìm được callback. Callback chạy xong chỉ có nghĩa đã chuyển yêu cầu cho Zalo, không chứng minh máy chủ chấp nhận emoji hoặc người nhận hiển thị giống bạn. Khi đang mở bảng, hãy đóng bảng trước khi đổi cuộc trò chuyện/tin nhắn để tránh giữ ngữ cảnh cũ.

Kiểm thử thủ công: gửi vào cuộc trò chuyện thử nghiệm, kiểm tra phía người nhận; thử emoji thường và emoji ghép; thử mở lại menu, đổi cuộc trò chuyện, reload, chế độ tối và tìm kiếm không dấu. Chưa xác nhận tích hợp trên phiên Zalo thật trong môi trường phát triển.

Nguồn tham khảo: https://github.com/ducladev/zalo-custom-reaction (tác giả Anh Duc Le, MIT). Không cấu hình updateURL/downloadURL để tránh bị bản gốc ghi đè.


## Bản 2.0.1

- Giao diện nhỏ hơn, màu phẳng, bỏ hiệu ứng phóng to emoji.
- Mặc định chỉ hiển thị nhóm Cảm xúc; tìm kiếm có debounce 100 ms.
- Bỏ MutationObserver toàn trang; chỉ tìm menu sau tương tác, giới hạn tần suất.
- Nút ☺ ở góc phải giúp nhận biết script đã chạy. Nếu không thấy nút này, kiểm tra quyền chạy userscript của Tampermonkey và bật script, rồi tải lại trang.
- Nút góc phải chỉ gửi được khi menu reaction của đúng tin nhắn đang mở và tìm thấy callback. Nếu chưa tìm được, bảng hiển thị hướng dẫn thay vì đoán tin nhắn cần gửi.
- Chưa xác nhận selector/callback trên giao diện Zalo trong ảnh; cần kiểm thử trên trình duyệt thật. Không khẳng định đã sửa hoàn toàn lỗi tương thích hoặc đo được mức giảm lag.
