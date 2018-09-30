var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var Blog = require("./models/blog");
var User = require("./models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var express = require("express");
var app = express();
// APP CONFIG

// mongoose.connect("mongodb://localhost/blog_app_2");
mongoose.connect("mongodb://nasridb:Lollipop99@ds119523.mlab.com:19523/blogapp");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//passport config
app.use(require("express-session")({
    secret: "My Yelp Log",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//function for eq user
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});



//RESTFUL ROUTES
app.get("/", function(req, res){
	res.redirect("/blogs")
})
// INDEX ROUTE
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err) {
			console.log("Error")
		} else{
			res.render("index", {blogs: blogs})
		}
	})
});

// NEW ROUTE
app.get("/blogs/new",isLoggedIn, function(req, res){
	res.render("new")
});

// create route
app.post("/blogs", function(req, res){
	Blog.create(req.body.blog, function(err, createdBlogs){
		if(err) {
			console.log("error")
		} else {
			res.redirect("/blogs")
		}
	})
});

// show route
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			console.log("Error")
		} else{
			res.render("show", {blog: foundBlog})
		}
	})
});

//edit route
app.get("/blogs/:id/edit",isLoggedIn, function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err) {
			console.log("Error")
		} else{
			res.render("edit", {blog: foundBlog})
		}
	})
})

//update route
app.put("/blogs/:id",isLoggedIn, function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, foundBlog){
		if(err){
			console.log("Error")
		}else{
			res.redirect("/blogs/"+ req.params.id)
		}
	})
});

//delete route
app.delete("/blogs/:id",isLoggedIn, function(req, res){
	Blog.findByIdAndDelete(req.params.id, function(err){
		if(err){
			console.log("Error")
		} else{
			res.redirect("/blogs")
		}
	})
})

//auth routes

// register route
app.get("/register", function(req, res){
	res.render("register")
})

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log("err")
            return res.render("register")
        }
        passport.authenticate("Local")(req, res, function(){
            res.redirect("/blogs");
        })
    })
})


//LOGIN ROUTE
app.get("/login", function(req, res){
	res.render("login");
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
}), function(req, res){
    res.send("login happens here")
})

//logout route
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/blogs");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
};









app.listen(3000, function(){
    console.log("server has started")
});