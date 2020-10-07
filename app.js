var express = require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride =require("method-override");
var flash       = require("connect-flash");

//requiring routes
var commentRoutes= require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

// seed the DB
// seedDB();


mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
// mongoose.connect('mongodb+srv://gaby911:67gaby91@cluster0.vztki.mongodb.net/yelp_camp?retryWrites=true&w=majority');

mongoose.set('useCreateIndex', true);

//for changing the db
// var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v13";
// mongoose.connect(url);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));// add the CSS connection
app.use(methodOverride("_method"));
app.use(flash());

app.set("view engine","ejs");

//Passport Configuration 
app.use(require("express-session")({
    secret: " This is my secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
    next();
});


//using routes files 
app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(3000,function(){
console.log("YelpCamp server started!");
});