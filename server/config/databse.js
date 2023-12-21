const moongose = require("moongoose");
require("dotenv").config();

const {MONGODB_URL} = process.env;
exports.connect =() =>{
    moongose.connect(MONGODB_URL,{
        useNewUrlParser :true,
        useUnifiedTopology:true,
    })
    .then(console.log(`DB Connection Successfully`))
    .catch((err) => {
        console.log(`DB Connection Failed`);
        console.log(err);
        process.exit(1);
    });
};
