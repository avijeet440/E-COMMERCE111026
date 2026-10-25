
import express from "express";

import {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Existing routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// New password-reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Existing protected route
router.get("/me", protect, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});

export default router;
