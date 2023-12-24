const { instance } = require("../config/razorpay");
const Course = require("../model/Course");
const User = require("../model/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

exports.capturePayment = async (req, res) => {
    const { course_id } = req.body;
    const userId = req.user.id;

    if (!course_id) {
        return res.status(402).json({
            success: false,
            message: "Please Provide Course ID"
        })
    }
    let course;
    try {
        course = await Course.findById(course_id);
        if (!course) {
            return res.json({
                success: false,
                message: "Could not Find The Course",
            });
        }
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentsEnroled.includes(uid)) {
            return res.status(200).json({
                success: true,
                message: "Student is already Enrolled",
            });
        }

    } catch (error) {
        console.log(error)
        return res.ststus(500).json({
            success: false,
            message: error.message,
        })
    }

    // order create 
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            courseId: course_id,
            userId,
        }
    };

    try {
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        return res.status(200).json({
            success: true,
            CourseName: Course.CourseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,

        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Could not initiate order"
        })
    }

};
    exports.verifySignature = async (req, res) => {
        const webhookSecret = "12356789";
        const signature = req.headers["x-razorpay-signature"];
        const shasum = crypto.createHmac("sha256", webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");

        if (signature === digest) {
            console.log("Payment is Authorized");
            const { courseId, userId } = req.body.payload.payment.entity.notes;

            try {
                const enrolledCourse = await Course.findOneAndUpdate(
                    { _id: courseId },
                    {$push:{studentsEnroled :userId}},
                    {new:true},
                );
                if(!enrolledCourse) {
                    return res.status(500).json({
                        success:false,
                        message:"Course not found",
                    });
                }

                console.log(enrolledCourse);

                const enrolledStudent = await User.findByIdAndUpdate(
                    {_id:userId},
                    {$push:{courses:courseId}},
                    {new:true},
                );
                console.log(enrolled);
                
                const emailResponse = await mailSender (
                    enrolledStudent.email,
                    "Congratulations from Student Saarthi",
                    "Congratulations, you are onboarded into new Student Saarthi Course",
                )

                console.log(emailResponse);
                return res.status(200).json({
                    success:true,
                    message:"Signature Verified and Course Added",
                });

            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    success:false,
                    message:error.message,
                });
            }

        }else{
            return res.status(400).json({
                success:false,
                message:'Invalid request',
            });
        }
    }


