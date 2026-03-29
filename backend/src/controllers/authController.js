import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Session } from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; 


export const signUp = async (req, res) => {
    try {
        const {username, password, email, firstName, lastName} = req.body;

        if(!username || !password || !email || !firstName || !lastName) {
            return res
                .status(400)
                .json({
                    message: "Không thể thiếu thông tin bắt buộc",
                });
        }

        // Kiểm tra username đã tồn tại chưa
        const duplicate = await User.findOne({username});

        if(duplicate) {
            return res
                .status(409)
                .json({
                    message: "Username đã tồn tại, vui lòng chọn username khác",
                }); 
        }
        // mã hóa password
        const hashedPassword = await bcrypt.hash(password, 10); // salt = 10, 10 là số rounds để tăng độ bảo mật, càng cao thì càng an toàn nhưng cũng tốn thời gian hơn


        // Tạo user mới 
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`
        });


        // return
        return res.sendStatus(204); // 204 No Content, không trả về dữ liệu gì, chỉ thông báo thành công

    } catch (error) {
        console.error("Error occurred while signing up:", error);
        return res.status(500).json({message: "Đã xảy ra lỗi khi đăng ký"});
    } 
};

export const signIn = async (req, res) => {
try {
    // lấy input từ request body
    const {username, password} = req.body;

    if(!username || !password) {
        return res
            .status(400)
            .json({
                message: "Username và password là bắt buộc",
            });
    }

    // lấy hashedPassword từ database dựa trên username để so sánh với password người dùng nhập vào sau khi đã được hash
    const user = await User.findOne({username});
    if(!user) {
        return res
            .status(401)
            .json({
                message: "Username hoặc password không đúng",
            });
    }

    // kiem tra password có khớp với hashedPassword trong database không
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if(!passwordCorrect) {
        return res
            .status(401)
            .json({
                message: "Username hoặc password không đúng",
            });
    }

    // nếu khớp, tạo accessToken (JWT) và trả về cho client
    const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL});

    // tạo refreshToken (JWT) và lưu vào database, trả về cho client
    const refreshToken = crypto.randomBytes(64).toString('hex'); // tạo refreshToken ngẫu nhiên, không phải JWT vì refreshToken thường được lưu trữ ở server để quản lý, không cần giải mã như JWT, chỉ cần một chuỗi ngẫu nhiên đủ dài để đảm bảo tính bảo mật

    // tạo session mới để lưu refreshToken, có thể lưu trong Redis hoặc MongoDB
    await Session.create({
        userId: user._id,
        refreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL), // 14 ngày
    });

    // trả refreshToken về trong cookies 
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // chỉ cho phép truy cập cookie từ server, không cho phép truy cập từ client (JavaScript), giúp ngăn chặn các cuộc tấn công XSS
        secure: true, // chỉ gửi cookie qua kết nối HTTPS, giúp bảo vệ cookie khỏi bị đánh cắp qua các kết nối không an toàn
        sameSite: 'none', // cho phép gửi cookie trong các yêu cầu cross-site, cần thiết khi frontend và backend ở hai domain khác nhau
        maxAge: REFRESH_TOKEN_TTL, // thời gian sống của cookie, nên đặt trùng với thời gian sống của refreshToken để đồng bộ
    });

    // trả accessToken về trong response body
    return res.status(200).json({
        message: `User ${user.displayName} đăng nhập thành công`,
        accessToken,
    });

} catch (error) {
    console.error("Error occurred while signing in:", error);
    return res.status(500).json({message: "Đã xảy ra lỗi khi đăng nhập"});  
}
};
