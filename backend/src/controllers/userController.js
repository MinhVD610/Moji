export const authMe = async (req, res) => {
    try {
        const user = req.user; // Lấy thông tin người dùng từ middleware auth
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        return res.status(200).json({ user });
        
    } catch (error) {
        console.error('Loi khi goi API authMe:', error);
        return res.status(500).json({ message: 'Loi server' });
    }
}