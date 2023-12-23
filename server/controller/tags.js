const Tag  = require("../model/tags");

exports.createCategory = async(req,res) => {
    try{

        const {name,description} = req.body;

        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        //entry in db 
        const tagDetails = await Tag.create({
            name:name,
            description:description,
        });
        console.log(tagDetails);

        return res.status(200).json({
            success:true,
            message:"Tag created successfully",
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success :false ,
            message :"Cannot create Tag Handler ",
        })
    }
}


exports.showAllCategory = async(req, res) => {
   try{
    const alltag  = await.Tag.find({} ,{name:true , description:true});
    return res.status(200).json({
        success:true,
        message:"All Tag details Found",
        alltag,
    })

   }catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Getting All tag details get corrupted",
    })
   }
}

