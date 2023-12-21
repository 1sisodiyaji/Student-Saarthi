const mongoose = require("mongoose");

// Define the Profile schema
const profileSchema = new mongoose.Schema({
	gender: {
		type: String,
        required:true,
	},
	dateOfBirth: {
		type: String,
        required:true,
	},
	about: {
		type: String,
		trim: true,
	},
	contactNumber: {
		type: Number,
		trim: true,
        required:true,
	},
});

// Export the Profile model
module.exports = mongoose.model("Profile", profileSchema);
