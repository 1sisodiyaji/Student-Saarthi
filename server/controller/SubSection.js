const SubSection = require("../model/SubSection");
const Section = require("../model/Section");
const { uploadImageCloudinary } = require("../utils/imageUploader");


exports.CreateSubSection = async (req, res) => {
   try{
    const {sectionId , title , timeDuration , description} = req.body ;
    const video = req.videoFile;

    if(!sectionId || !title || !timeDuration || !description){
        return res.status(400).json({
            success:false,
            message:"all data fields are requied",
        })
    }

    const uploadDetails = await uploadImageCloudinary(video , process.env.FOLDER_NAME);

    const SubSectionDetails = await SubSection.create({
        title:title,
        timeDuration:timeDuration,
        description:description,
        videoUrl:uploadDetails.secure_url,
    })
    const updatedSection = await Section.findByIdAndUpdate({_id :sectionId},
        {
            push :{
                subsection :SubSectionDetails._id,
            }},
           {new :true});

     return res.status(200).json({
        success:true,
        message:"SubSection Created SuccessFully",
     })  
   }catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Failed To create SubsSection ",
    })
   }    
}


