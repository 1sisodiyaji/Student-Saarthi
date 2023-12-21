const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const user = require("../model/User")

dotenv.config();

exports.auth = async (req, res , next) => {
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer","");

        if(!token){
            return res.status(401).json({
                sucees:false,
                message:` Token is Missing`,
            });
        }
        try{
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }catch(error){
            return res.status(401).json({
                sucees:false,
                message:` Token is invalid`
            })
        }
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went wromg during validation",
        });
    }
};

exports.IsStudent = async (req, res, next) => {
    try{
    const userDetails = await User.findOne({email :req.user.email});
    if(userDetails.accountType !== "Student"){
        return res.status(401).json({
            success:false,
            message:"These Route is protected for Students"
        });
    }
    next();
  }catch(error){
        return res.status(401).json({
            success:false,
            message:"User can't be Verified"
        })
  }
};

exports.IsAdmin = async (req,res,next) => {
    try{
        const userDetails = await user.findOne({email:req.user.email});
        if(userDetails.accountType !== "Admin"){
            return res.status(401).json({
                suceess:false,
                message:"This Route is Protected For Admin"
            })
        }
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"User Role Can't Be Verified"
        });
    }
};

exports.IsInstructor = async (req,res,next) =>{
    try{
        const userDetails = await user.findOne({email:req.user.email});
        console.log(userDetails);
        console.log(userDetails.accountType)
        if(userDetails.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This route is protected for Instructors"
            })
        }
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"User Role can't be Verified"
        });
    }
};