import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
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
    type: String,
  },
  password: {
    type: String,
    required: true
  }
});

export const User = mongoose.model("User", userSchema);