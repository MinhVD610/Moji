import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectedRoute = async (req, res, next) => {
    try {
        // lấy token từ header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

        if(!token) {
            return res.status(401).json({message: "Khong tim thay accessToken trong cookie"});
        }
        // xac nhan token co hop le hay khong
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , async (err, decodedUser) => {
            if(err) {
                console.error("Loi khi giai ma JWT trong authMiddleware", err);
                return res.status(403).json({message: "AccessToken het han hoac khong hop le"});
            }

        //  tim user trong database de kiem tra xem nguoi dung co ton tai hay khong, va lay thong tin user de gan vao request
        const user = await User.findById(decodedUser.userId).select("-hashedPassword"); // không trả về hashedPassword trong thông tin user để đảm bảo an toàn
        if(!user) {
            return res.status(401).json({message: "Nguoi dung khong ton tai"});
        }

        //  tra user ve trong request de cac controller sau co the truy cap duoc
        req.user = user; // gắn thông tin user vào request để các controller sau này có thể truy cập được
        next(); // cho phép tiếp tục xử lý request
        });
    } catch (error) {
        console.error("Loi khi xac minh JWT trong authMiddleware", error);
        return res.status(500).json({message: "Loi he thong"});
    }
};