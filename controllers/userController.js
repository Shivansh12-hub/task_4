import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const getUserData = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.json({
        success: false,
        message: "No token found, please login again",
      });
    };

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; 
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getUserData
}