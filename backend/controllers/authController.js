

//Register a new user;

import crypto from "node:crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Register a new user
const registerUser = async (req, res, next) => {
    try {
        // 1. Get form data sent by the frontend
        const { name, email, password } = req.body;

        // 2. Check that all required fields were provided
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email, and password",
            });
        }

        // 3. Check whether this email is already registered
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // 4. Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create the user in MongoDB
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // 6. Generate a JWT for the newly created user
        const token = generateToken(user._id);

        // 7. Send the token and user information to React
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

//Log in an existing user

const loginUser = async (req, res, next) => {
    try {
        //Get the login details from the frontend or request body

        const { email, password } = req.body;
        //Checks if the user exists in the database

        const user = await User.findOne({ email });
        //Stop if the user doesn't exist
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        //Checks if the password is correct or not
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        //Stop if the password is incorrect

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                meassage: ' Invalid email or password'
            })
        }
        //Create a token after successful login and send it to the frontend

        const token = generateToken(user._id);
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        next(error)
    }
}




/*
 * STEP 1: Request a password-reset email
 * Route: POST /api/auth/forgot-password
 */

const forgotPassword = async (req, res, next) => {
    try {
        const email = req.body.email?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        const user = await User.findOne({ email });

        // Do not reveal whether an account exists.
        const message =
            "If an account exists for this email, a reset link will be sent.";

        if (!user) {
            return res.status(200).json({
                success: true,
                message,
            });
        }

        // Create a random token for the email link.
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Save only the hashed token in MongoDB.
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await user.save();

        // Connect to Gmail SMTP.
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Link opens your React frontend.
        const resetUrl =
            `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: user.email,
                subject: "Reset your BONDOR password",

                text: `Hello ${user.name},

You requested a password reset for your BONDOR account.

Open this link to set a new password:
${resetUrl}

This link expires in 15 minutes. If you did not request this, ignore this email.`,

                html: `
                    <h2>Reset your BONDOR password</h2>
                    <p>Hello ${user.name},</p>
                    <p>Click below to choose a new password.</p>
                    <p>
                        <a href="${resetUrl}"
                           style="background:#171717;color:white;padding:12px 20px;text-decoration:none;border-radius:6px;">
                            Reset Password
                        </a>
                    </p>
                    <p>This link expires in 15 minutes.</p>
                    <p>If you did not request a reset, ignore this email.</p>
                `,
            });
        } catch (emailError) {
            // Remove the token if sending the email fails.
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();

            throw emailError;
        }

        return res.status(200).json({
            success: true,
            message,
        });
    } catch (error) {
        next(error);
    }
};



/*
 * STEP 2: Reset the password using the email link
 * Route: POST /api/auth/reset-password/:token
 */

const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Reset token is required.",
            });
        }

        if (
            typeof password !== "string" ||
            password.length < 6 ||
            password.length > 72
        ) {
            return res.status(400).json({
                success: false,
                message: "Password must be between 6 and 72 characters.",
            });
        }

        // Hash the token from the URL.
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find the user with a matching, unexpired token.
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Reset link is invalid or has expired.",
            });
        }

        // Hash the new password using your existing bcryptjs library.
        user.password = await bcrypt.hash(password, 10);

        // Invalidate the link after a successful reset.
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. You can now log in.",
        });
    } catch (error) {
        next(error);
    }
};


export {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
}