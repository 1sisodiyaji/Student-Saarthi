const cloudinary = require("cloudinary").v2
exports.uploadImageCloudinary = async (file,folder,height,quality) =>{
    const options = {folder}
    if(height){
        options.Height = height
    }
    if(quality){
        options.quality = quality
    }
    options.resource_type = "auto"
    console.log("OPTIONS",options)
    return await cloudinary.uploader.upload(file.tempFilePath ,options)
}