var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var flash 			= require("connect-flash")
var Blog = require("./models/blog");
var User = require("./models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var express = require("express");
var app = express();

var blogRoute = require("./routes/blog");
var indexRoutes = require("./routes/index");
// APP CONFIG

// mongoose.connect(process.env.DATABASEURL);
mongoose.connect("mongodb://localhost/blog_app_2");
// mongoose.connect("mongodb://nasridb:Lollipop99@ds119523.mlab.com:19523/blogapp");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


//routes
app.use(blogRoute);
app.use(indexRoutes);








app.listen(process.env.PORT || 3000, function(){
    console.log("server has started")
});
