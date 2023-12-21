const mailSender = require("nodemailer")
const mailSender = async (email,title,body) =>{
    try{
        let transporter = modemailer.createTransport({
            host : process.env.MAILOST,
            auth :{
                user :process.env.MAIL_USER,
                pass : process.env.MAIL_PASS,
            },
            secure :false,
        })
        let info = await transporter.sendMail({
            from:`"Studynotion | CodeHelp" <${process.env.MAIL_USER}>`,
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`,
        })
        console.log(info.response)
        return info
    }catch(error){
        console.log(error.message)
        return error.message
    }
}
module.exports = mailSender