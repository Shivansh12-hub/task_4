import express from "express";
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, verifyEmail } from "../controllers/authController.js";
import { userAuth } from "../middleware/userAuth.js";

const authRouters = express.Router();

// authRouters.post('/register', register);

authRouters.post('/register/send-verify-otp', register);

authRouters.post('/login', login);
authRouters.post('/logout', logout);
// authRouters.post('/send-verify-otp', userAuth,sendVerifyOtp);
authRouters.post('/verify-account', userAuth, verifyEmail);
authRouters.post('/is-auth', userAuth, isAuthenticated);
authRouters.post('/reset-otp', sendResetOtp);
authRouters.post('/resetPassword', resetPassword);
export {
    authRouters
}
