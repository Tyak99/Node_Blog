var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");
var middleware = require("../middleware");



// INDEX ROUTE
router.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err) {
			console.log("Error")
		} else{
			res.render("index", {blogs: blogs})
		}
	})
});

// NEW ROUTE
router.get("/blogs/new",middleware.isLoggedIn, function(req, res){
	res.render("new")
});

// create route
router.post("/blogs", function(req, res){
	var title = req.body.title;
	var image = req.body.image;
	var body = req.body.body;
	var user = {
		id: req.user._id,
		username: req.user.username
	};
	var newBlog = {title: title, image: image, body: body, user: user}
	Blog.create(newBlog, function(err, createdBlogs){
		if(err) {
			console.log("error")
		} else {
			res.redirect("/blogs")
		}
	})
});

// show route
router.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			console.log("Error")
		} else{
			res.render("show", {blog: foundBlog})
		}
	})
});

//edit route
router.get("/blogs/:id/edit",middleware.checkBlogOwner, function(req, res){
		Blog.findById(req.params.id, function(err, foundBlog){
			res.render("edit", {blog: foundBlog})
})
});

//update route
router.put("/blogs/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, foundBlog){
		if(err){
			console.log("Error")
		}else{
			res.redirect("/blogs/"+ req.params.id)
		}
	})
});

router.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndDelete(req.params.id, function(err){
		if(err){
			console.log("Error")
		} else{
			res.redirect("/blogs")
		}
	})
})



module.exports = router;