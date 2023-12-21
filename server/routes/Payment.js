const express = require("express")
const router = express.Router();
const {
    capturePayment, verifypayment , sendPaymentsSuccessEmail
} = require("../controller/payments")

const {auth,isInstructor ,isStudent , isAdmin} = require("../middleware/auth")

router.post("/capturepayments",auth,isStudent,capturePayment)
router.post("/verifyPayment",auth,isStudent,capturePayment)
router.post("/sendPaymentsSuccessEmail",auth,isStudent,sendPaymentsSuccessEmail)

module.exports = router