const mongoose = require("moongoose");
const tagSchema = new mongoose.Schema({
    name:{
        type:String,
        required :true,
    },
    description : {
        type:String,
    },
    course: {
        type:mongoose.Schema.Type.ObjectId,
        ref : "Course",
    },
});

module.exports = mongoose.model("Tag",tagSchema);