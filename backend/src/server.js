import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import authRoute from './routes/authRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middlewares giúp parse JSON request body 
// và làm cho dữ liệu có thể truy cập được thông qua req.body,
// đồng thời cũng giúp xử lý các lỗi liên quan đến JSON nếu có.
// Giúp cho việc xây dựng API trở nên dễ dàng hơn khi làm việc với dữ liệu JSON.
app.use(express.json());

// public routes
app.use('/api/auth', authRoute);


// private routes

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
