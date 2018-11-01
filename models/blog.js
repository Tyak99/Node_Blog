//mMONGOOSE MODEL/CONFIG 
var mongoose = require("mongoose");


var blogSchema = mongoose.Schema({
	title: String,
	image: String,
	body: String,
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Blog", blogSchema);