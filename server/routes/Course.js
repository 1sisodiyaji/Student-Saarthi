const express = require("express")
const router = expressRouter();

const {createCourses,
      getAllCourses,
      getCourseDetails,
      getFullCourseDetails,
      deleteCourse,    
} = require("../controller/Course")

const {showAllCategories ,createCategory, categoryPageDetails,} = require("../controller/category");

const {createSection,updateSection,deleteSection} = require("../controller/section")

const {createsubSection , updatesubSection,deletesubSection} = require("../controller/subsection")

const {createRating , getAverageRating , getAllRatingReview} = require("../controller/RatingandReview")

const {updateCourseProgress , gatProgressPercentage}= require("../middleware/auth")

router.post("/createCourse",auth,isInstructor,createCourses)
router.post("/editCourse",auth,isInstructor,editCourse)
router.post("/addSection",auth,isInstructor,createSection)
router.post("/updatesection",auth,isInstructor,updateSection)
router.post("/deleteSection",auth,isInstructor,deleteSection)
router.post("/updateSubSection",auth,isInstructor,updatesubSection)
router.post("/deleteSubSection",auth,isInstructor,deletesubSection)
router.post("/addSubSection",auth,isInstructor,createSubSection)
router.post("/getInstructorCourses",auth,isInstructor,getInstructorCourses)
router.post("/getAllCourses",getAllCourses)
router.post("/getCourseDetails",getCourseDetails)
router.post("/getFullCourseDetail",getFullCourseDetails)
router.post("/updateCourseProgress",auth,getFullCourseDetails)
router.post("/updateCourseProgress",auth,IsStudent,updateCourseProgress)
router.delete("/deleteCourse",deleteCourse)
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatingReview)

module.exports = router