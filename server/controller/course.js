const Course = require("../model/Course");
const  Tag = require("../model/tags");
const User = require("../model/User");
const user = require("../model/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");


exports.createCourse = async (req,res) => {
     try{

        const {courseName , courseDescription, whatWillYouLearn , price , tag} = req.bosy;

        const thumbnail = req.files.thumbnailImage;

        if(!courseName || !courseDescription || !whatWillYouLearn || !price || !tag|| !thumbnail || !thumbnailImage){
            return res.status(400).json({
                success:false,
                message:"All Fields Are Required To Fill",
            })
        }
        const userId = req.user.id;
        const instructorDetails  = await User.findById(userId);
        console.log("Instructor Details :" ,instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor Details are not found",
            })
        }

        //tags part
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:"Tag Details not Found",
            });
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail , process.env.FLODER_NAME);

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatWillYouLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })

        await User.findByIdAndUpdate({_id : instructorDetails._id},{
            $push : {
                courses:newCourse._id,
            }
        },{new:true},)

         // update schema tag 
        
         return  res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
         })

     }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unabel to create courses",
            error:error.message,
        })
     }
}

exports.getAllCourses = async (req , res) => {
    try{
            const allCourses = await Course.find({});
            return res.status(200).json({
                success:true,
                message:"Data For all courses fetched successfully",
                data:allCourses,
            })
        }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"unable to fetch all courses details",
            error:error.message,
        })
    }
}