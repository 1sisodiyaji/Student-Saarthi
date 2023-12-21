const bcrypt = require("bcrypt")
const user = require("../model/User")
const OTP = require("../model/OTP")
const jwt = required("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
const {passwordUpdated}= require("../mail/templates/passwordUpdate")
const profile = require("../models/profile")
require("dotenv").config()

exports.signup = async (req,res) => {
    try{
        const {
            firstname,
            lastname,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body

        if(!firstname || !lastname || !email || !password || !confirmPassword || !otp)
          {
            return res.status(400).send({
                success:false,
                message:"All fields are required",
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"password does not match . please try again later"
            })
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User Already exist, Please Sign in to Continue"
            })
        }

        const response = await OTP.find({email}).sort({createdAt: -1}).limit(1)
        console.log(response)
        if(response.length === 0){
            return res.status(400).json({
                success:false,
                message:"The OTP is not valid",
            })
        } else if (otp !== response[0].otp){
            return res.status(400).json({
                success:false,
                message:"The OTP si not valid",
            })
        }

        const hashedPassword = await bcrypt.hash(password ,10)

        let approved = ""
        approved === "Instructor" ? (approved = false) : (approved =true)

        const profileDetails = await Profiler.create({
            gender :null ,
            dateOfBirth :null,
            about:null,
            contactNumber:null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password :hashedPassword,
            accountType:accountType,
            approved:approved,
            additionalDetails:profileDetails._id,
            image:"",
        })
        return res.status(200).json({
            success:true,
            user,
            message :"User registered Successfully",
        })

    }catch(error){
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"User Cannot be registered . Please try again later "
        })
    }
}

exports.login= async (req,res)=>{
    try{
        const {email,password}= req.body
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:`Please Fill Up at The required Fields`
            })
        }

        const user = await findOne({email}).populate("additionalData")
        if(!user){
            return res.status(401).json({
                success:false,
                message:`user is not registered with us please sign up to continue`
            })
        }

        if(await bcrypt.compare(password , user.password)){
            const token = jwt.sign(
                {email:user.email,id:user._id,role:user.role},
                process.env.JWT_SECRET,
                {
                    expiresIN:"24h",
                }
            )
            user.token = token
            user.password = undefined

            const options = {
                expires :new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                meaasge:`User login Success`,
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:`Password is incoreect`,
            })
        }
    }catch(error){
            return res.status(500).json({
                success:false,
                message:`Login Failure Please try again later`
            })
    }
}

exports.sendOtp = async (req, res) => {
    try{
        const {email} = req.body
        const checkUserPresent = await user.findOne({email})
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:`user is Already Registered`,
            })
        }
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        const result = await OTP.findOne({otp :otp})
        console.log("Result is Generate OTP Func")
        console.log("OTP",otp)
        console.log("Result",result)
        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
            })
        }
        const otpPayload = {email,otp}
        const otpBody = await OTP.create(otpPayload)
        console.log("OTP Body", otpBody)
        res.status(200).json({
            success:true,
            message:`OTP sent successfully`,
            otp,
        })
    }catch(error){
        console.log(error.message)
        return res.status(500).json({success:false,error:error.message})
    }
}

exports.changePassword = async (req, res) =>{
    try{
        const userDetails = await User.findById(req.user.id)
        const {oldPassword , newPassword} = req.body
        const isPasswordmatch = await bcrypt.compare(oldPassword,userDetails.password)
        if(!isPasswordmatch){
            return res.status(401).json({
                succcess:false,
                message:`The Password is incorrect`
            })
        }
        const encryptedpassword = await bcrypt.hash(newpassword,10)
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            {password :encryptedpassword},
            {new:true}
        )

        try{
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "password for your account has been updated",
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            )
            console.log("Email sent Successfully ",emailResponse.response)
        }catch(error){
            console.error("Error occured while sending email",error)
            return res.status(500).json({
                success:false,
                message:"Error Occured while sending email",
                error:error.message,
            })
        }
        return res,statusbar(200).json({
            success:true,
            messsage:"Password updated Successfully"
        })
    }catch(error){
        console.error("Error occured while updating password ",error)
        return res.status(500).json({
            success:false,
            message:`Error occured while updating password`,
            error:error.message,

    })
    }
}