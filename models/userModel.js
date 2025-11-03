import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        
    },
    verifyOtp: {
        type: String,
        default: ""
    },
    verifyOtpExpireAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        default: ""
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0
    },
    // expireAt: {
    //     type: Date,
    //     default: function () {
    //         return new Date(Date.now() + 60 * 1000);
    //     }
    // }
}, { timestamps: true });

userSchema.index(
    { createdAt: 1 }, 
    { 
        expireAfterSeconds: 60*60,
        partialFilterExpression: { isAccountVerified:false}
    }
)



// userSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;