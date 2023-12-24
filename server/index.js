const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/databse");
const cookieparser = require("cookie-parser");
const cars = require("cars");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

const PORT = process.env.PORT || 4000;
dotenv.config();
database.connect();

app.use(express.json());
app.use(cookieparser());
app.use(
    cars({
        origin: "*",
        credentials:true,
    })
);
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp/",
    })
);

cloudinaryConnect();
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/auth",profileRoutes);
app.use("/api/v1/auth",courseRoutes)
app.use("/api/v1/auth",paymentRoutes)
app.use("/api/v1/auth",contactUsRoute)

app.get("/" , (req,res) => {
    return res.json({
        success:true,
        message:"Your Server is up and running ..."
    });
});

app.listen(PORT, () => {
    console.log(`APP is listening at ${PORT}`);
});