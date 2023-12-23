const Section = require("../model/Section");
const Course = require('../model/Course');

exports.createSection = async (req , res) => {
    try{
        const {sectionName , courseId} = req.body;
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Cannot get details "
            })
        }
        const newSection  = await  Section.create({sectionName});

        const updateCoursesDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    CourseContent: newSection._id,
                }
            },
            {new:true},
        )
        return res.status(200).json({
            successtrue,
            message:"Section created successfully",
            updateCoursesDetails,
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed To Create Sections.."
        })
    }
}


exports.updateSection = async (req, res) =>{
    try{
        const {sectionName , sectionId} = req.body;
        if(!sectionId || !sectionName){
            return res.status(400).json({
                success:false,
                message:"Cannot get section name or Id",
            })
        }

        const Section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

        return res.status(200).json({
            success : true,
            message: "Section Updated Successfully",
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message:"Cannot update Section",
        })
    }
}

exports.deleteSection = async (req, res ) => {
    try{

        const {sectionId} = req.body;
        if(!sectionId){
            return res.status(400).json({
                success :false ,
                message :"Cannot get SectionID"
            })
        }

        const deleteSection = await Section.findByIdAndDelete(sectionId);

        return res.status(200).json({
            success: true,
            message:"Deleted Successfully",
        })

    }catch(error){
        console.log(error);
        return res(500).json({
            success: false,
            message:"Failed to  deleted"
        })
    }
}

