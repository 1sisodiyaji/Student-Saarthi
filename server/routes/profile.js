const express= require("express")
const router = express.Router();
const {auth, isinstructor} = require("../middleware/auth")

const{
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
    instructorsDashBoards,
} = require("../controller/profilr")

router.delete("./deleteprofile",auth,deleteAccount)
router.put("/updateProfile",auth,updateProfile)
router.get("/getUserDetails",auth,getAllUserDetails)
router.get("/getEnrolledCourses",auth,getEnrolledCourses)
router.get("?updateDisplayPicture",auth,updateDisplayPicture)
router.get("/instructorDashboard",auth,isinstructor,instructorsDashBoards)

module.exports = router