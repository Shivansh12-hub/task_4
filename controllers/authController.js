import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";
import sgmail from "@sendgrid/mail"
sgmail.setApiKey(process.env.SENDGRID_API_KEY);


// export const register = async (req, res) => {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//         return res.json({
//             success: false,
//             message:"Enter all entries"
//         })
//     }

//     if (!validator.isEmail(email)) {
//         return res.json({
//             success: false,
//             message:"Envalid email please enter a valid email"
//         })
    
//     }
//     if (!validator.isStrongPassword(password, {
//     minLength: 8,
//     minLowercase: 1,
//     minUppercase: 1,
//     minNumbers: 1,
//     minSymbols: 1
//     })) {
//         return res.json({
//             success: false,
//             message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
//         });
//     }

//     try {
//         const existingUser = await userModel.findOne({ email });
//         if (existingUser) {
//             return res.json({
//                 success:false,
//                 message: "User already exist"
//             })
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = new userModel({ name, email, password: hashedPassword });
//         await user.save();

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '4d' });

//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: true,
//             sameSite:"None",
//             maxAge: 7 * 24 * 60 * 60 * 1000
//         });


//         const otp = String(Math.floor(100000 + Math.random() * 900000));
//         user.verifyOtp = otp;
//         user.verifyOtpExpireAt = Date.now() + 6 * 60 * 1000; // 6 minutes
//         await user.save();


//         const msg = {
//   to: email,
//   from: process.env.G_USER,
//   subject: "Your OTP Code for Account Verification",
//   text: `Hello ${name}, your OTP code is ${otp}. It is valid for 6 minutes.`,
//   html: `
//   <html>
//     <body style="font-family: Arial, sans-serif; background-color: #ffffff; color: #000000; margin: 0; padding: 0;">
//       <div style="max-width: 500px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
//         <h2 style="text-align:center; color:#333;">Account Verification</h2>
//         <p>Hello ${name},</p>
//         <p>Your One-Time Password (OTP) for verifying your account is:</p>
//         <div style="text-align:center; font-size: 24px; font-weight: bold; margin: 20px 0;">${otp}</div>
//         <p>This OTP is valid for 6 minutes. Please do not share it with anyone.</p>
//         <p>Thank you,<br/>Game Recommender Team</p>
//       </div>
//     </body>
//   </html>
//   `
// };
        
//         try {
//             await sgmail.send(msg);
//             console.log("Email from to",process.env.G_USER)
//             console.log("Email sent to", email);
//             } catch (error) {
//                 console.error(" Error sending email:", error);

//              return res.json({
//                 success: false,
//                 message: error.message,
//             });
//         };


//          return res.json({
//             success:true
//         })
//     } catch (error) {
//         console.error(error);
//         res.json({
//             success: false,
//             message: "Registration failed",
//             message: error.message
//         });
//     }
// }





export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Enter all entries"
        });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Envalid email please enter a valid email"
        });
    }

    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
        });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exist"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '4d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 6 * 60 * 1000; // 6 minutes
        await user.save();

        const msg = {
            to: email,
            from: process.env.G_USER,
            subject: "Your OTP Code for Account Verification",
            text: `Hello ${name}, your OTP code is ${otp}. It is valid for 6 minutes.`,
            html: `
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #ffffff; color: #000000; margin: 0; padding: 0;">
                <div style="max-width: 500px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                  <h2 style="text-align:center; color:#333;">Account Verification</h2>
                  <p>Hello ${name},</p>
                  <p>Your One-Time Password (OTP) for verifying your account is:</p>
                  <div style="text-align:center; font-size: 24px; font-weight: bold; margin: 20px 0;">${otp}</div>
                  <p>This OTP is valid for 6 minutes. Please do not share it with anyone.</p>
                  <p>Thank you,<br/>Game Recommender Team</p>
                </div>
              </body>
            </html>
            `
        };

        try {
            await sgmail.send(msg);
            console.log("Email from:", process.env.G_USER);
            console.log("Email sent to:", email);
        } catch (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(201).json({
            success: true,
            message: "User registered successfully. OTP sent to email."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
};









export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({   
            success: false,
            message: "Enter all entries"
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({   
                success: false,
                message: "User does not exist"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({   
                success: false,
                message: "Password incorrect"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '4d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({   
            success: true,
            message: "User logged in successfully",
            data: user
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({       
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};


export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });

        return res.status(200).json({   
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: error.message
        });
    }
};




export const verifyEmail = async (req, res) => {
    const { otp } = req.body; 
    const userId = req.userId; 

    if (!otp) {
        return res.status(400).json({
            success: false,
            message: "Missing OTP"
        });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        if (user.verifyOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired"
            });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};


export const isAuthenticated = async (req, res) => {
    try {
        return res.json({
            success: true,
            message:"Authenticated user"
        })
    } catch(error) {
        return res.json({
            success: false,
            message:error.message
        })
    }
}

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({   
            success: false,
            message: "Email is required"
        });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({  
                success: false,
                message: "User not found"
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 6 * 60 * 1000; // 6 minutes
        await user.save();

        const msg = {
            to: email,
            from: process.env.G_USER, 
            subject: "Password Reset OTP - Game Recommender",
            text: `Hello, your OTP for resetting your password is ${otp}. It will expire in 6 minutes. If you didn’t request this, please ignore this email.`,
            html: `
            <html>
              <body style="font-family: Arial, sans-serif; background-color: #ffffff; color: #000000; margin: 0; padding: 0;">
                <div style="max-width: 500px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                  <h2 style="text-align:center; color:#333;">Password Reset Request</h2>
                  <p>Hello,</p>
                  <p>We received a request to reset your password for your Game Recommender account. Use the following One-Time Password (OTP) to proceed:</p>
                  <div style="text-align:center; font-size: 24px; font-weight: bold; margin: 20px 0; letter-spacing: 2px;">
                    ${otp}
                  </div>
                  <p>This OTP is valid for <strong>6 minutes</strong>. Please do not share it with anyone.</p>
                  <p>If you didn’t request this, simply ignore this email — your password will remain unchanged.</p>
                  <p>Thank you,<br/>The Game Recommender Team</p>
                  <hr style="border:none; border-top:1px solid #eee; margin-top:30px;">
                  <p style="font-size: 12px; color: #666; text-align: center;">
                    This is an automated message. Please do not reply.
                  </p>
                </div>
              </body>
            </html>
            `
        };

        try {
            await sgmail.send(msg);
            console.log("Email sent from:", process.env.G_USER);
            console.log("Email sent to:", email);
        } catch (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({   
                success: false,
                message: "Failed to send OTP email",
                error: error.message
            });
        }

        return res.status(200).json({   
            success: true,
            message: "OTP successfully sent to your email"
        });

    } catch (error) {
        console.error("Error while generating/sending OTP:", error);
        return res.status(500).json({    
            success: false,
            message: "Error occurred while sending OTP",
            error: error.message
        });
    }
};


export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Enter all required fields",
        });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.status(401).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(410).json({ // 410 Gone = OTP expired
                success: false,
                message: "OTP expired",
            });
        }

        // ✅ Validate password strength
        if (!validator.isStrongPassword(newPassword, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
            });
        }

        // ✅ Hash and save new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });

    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
