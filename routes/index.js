var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//RESTFUL ROUTES
router.get("/", function(req, res){
	res.redirect("/blogs")
})


//auth routes

// register route
router.get("/register", function(req, res){
	res.render("register")
})

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            console.log("err")
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to MyBlog " + req.user.username)
            res.redirect("/blogs");
        })
    })
})


//LOGIN ROUTE
router.get("/login", function(req, res){
	res.render("login");
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
}), function(req, res){
})

//logout route
router.get("/logout", function(req, res){
	req.logout();
    req.flash("success", "You logged Out");
	res.redirect("/blogs");
})


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
};



module.exports = router;
