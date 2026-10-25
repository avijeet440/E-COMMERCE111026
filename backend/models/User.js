import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },

    // Stores the SHA-256 hash of the password-reset token.
    resetPasswordToken: {
        type: String,
        default: null,
    },

    // Stores the date and time when the reset token expires.
    resetPasswordExpires: {
        type: Date,
        default: null,
    },

}, {
    timestamps: true,
})

const User = mongoose.model('User', userSchema);
export default User;