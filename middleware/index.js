//rewuire my needed stuffs
var Blog = require("../models/blog");

middlewareObj = {};

middlewareObj.checkBlogOwner = function(req, res, next){
 	if(req.isAuthenticated()){
 		Blog.findById(req.params.id, function(err, foundBlog){
 			if(err){
 				res.redirect("back");
 			} else{
 				if(foundBlog.user.id.equals(req.user.id)){
 					return next();
 				} else {
 					res.redirect("back");
 				}
 			}
 		})
 	} else {
 		res.redirect("back");
 	}

 }

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error", "Hi there! You need to be logged in to do that!")
    res.redirect("/login")
};


module.exports = middlewareObj;