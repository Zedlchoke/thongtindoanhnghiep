# Sử dụng môi trường Node.js phiên bản nhẹ, tối ưu cho server
FROM node:20-alpine

# Cài đặt thư mục làm việc bên trong container
WORKDIR /app

# Copy các tệp cấu hình thư viện vào trước (giúp build nhanh hơn ở các lần sau)
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn dự án vào container
COPY . .

# Build ứng dụng (Đóng gói mã nguồn)
RUN npm run build

# Mở cổng 5000 để giao tiếp (nếu server của bạn dùng port khác, hãy đổi số này)
EXPOSE 5000

# Lệnh khởi động ứng dụng khi container bắt đầu chạy
CMD ["npm", "run", "start"]