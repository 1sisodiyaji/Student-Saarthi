const cloudinary  = require("cloudinary").v2;

exports.cloudinaryConnect = () => {
    try{
    cloudinary.config({
        cloud_name :process.env.dbqq41bpc,
        api_key :process.env.913494668998485,
        api_secret :process.env.API_SECRET,
    });

}catch(error){
    console.log(error);
}
    
};