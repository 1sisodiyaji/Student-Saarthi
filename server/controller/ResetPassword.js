const User = require("../model/User");
const user = require("../model/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

exports.resetPasswordToken  = async (req , res){
    try{
        const email = req.bosy.email;
        const user =  await User.findOne({email :email});

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        const token = crypto.randomUUID();
        const upateDetails = await User.findOneAndUpdate(
            {email :email},
            {
                token:token, 
                resetPasswordExpires :Date.now() + 5*60*1000,
            },
            {new:true}
        );

        const url = `http://localhost:3000/update-password/${token}`
        await mailSender(email,"Password ResetLink",`Password Reset Link ${url}`);

        return res.status(200).json({
            success:true,
            message:"Email Sent Successfully , please check email and change password",
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message :"Cannot reset Password"
        })
    }

}
 
exports.resetPassword = async (req , res ) => {
    try{
        const {password , confirmPassword , token} = req.body;
        if(password !== confirmPassword){
            return res.status(402).json({
                success:false,
                message:"password does not Match"
            });
        }

        const userdetail = await User.findOne({token :token});
        if(!userdetail) {
            return res.status(404).json({
                success:false,
                message:"Token is not Valid"
            });
        }

        if(userdetail.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"Token is Expired , Please regenerate your token",
            });
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );

        return res.status(200).json({
            success:true,
            message:"Password reset successful",
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Error occured during reset password"
        })
    }
}