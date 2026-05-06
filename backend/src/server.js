import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import { protectedRoute } from './middlewares/authMiddleware.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares giúp parse JSON request body 
// và làm cho dữ liệu có thể truy cập được thông qua req.body,
// đồng thời cũng giúp xử lý các lỗi liên quan đến JSON nếu có.
// Giúp cho việc xây dựng API trở nên dễ dàng hơn khi làm việc với dữ liệu JSON.
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL, // Chỉ cho phép frontend của bạn truy cập API
  credentials: true, // Cho phép gửi cookie trong các yêu cầu từ frontend
})); 

// public routes
app.use('/api/auth', authRoute);


// private routes
app.use(protectedRoute); // áp dụng middleware bảo vệ cho tất cả các route sau nó, đảm bảo rằng chỉ những request có token hợp lệ mới có thể truy cập được các route này
app.use('/api/users', userRoute);

connectDB()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server đang chạy trên PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("❌ Lỗi kết nối Database, Server không thể khởi chạy!");
    console.error(error);
  });
