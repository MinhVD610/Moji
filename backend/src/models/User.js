import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  avatarUrl: {
    type: String, // link CDN để hiển thị hình
  },
  avatarId: {
    type: String, // id của ảnh trên CDN để quản lý (xóa, cập nhật) nếu cần, Cloudinary public_id để xóa ảnh khi người dùng cập nhật avatar mới hoặc xóa tài khoản
  },
  bio: {
    type: String,
    maxLength: 500,
  },
  phone: {
    type: String,
    sparse: true, // chỉ lưu khi có giá trị, không bắt buộc, nhưng nếu có thì phải là duy nhất.
  },
}, {
  timestamps: true, // tự động thêm createdAt và updatedAt
});

 const User = mongoose.model("User", userSchema);
 export default User;