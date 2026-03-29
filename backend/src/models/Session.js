import mongoose from "mongoose";


const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    refreshToken: {
        type: String,
        required: true,
        uniqe: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true, // tự động thêm createdAt và updatedAt
});

// tu động xóa session khi refreshToken hết hạn

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model("Session", sessionSchema);