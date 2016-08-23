var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var methodOverride = require("method-override");

var passport = require('passport');
var LocalStrategy = require('passport-local');

var flash = require('connect-flash');

app.use(methodOverride("_method"));

//import models
var Blog = require('./models/blog.js');
var User = require('./models/user.js');

//import routes
var blogRoutes = require('./routes/blogs.js');
var indexRoutes = require('./routes/index.js');
var userRoutes = require('./routes/users.js');

//var uploadImageRoutes = require('./routes/uploadimage.js');



//passport config
app.use(require("express-session")({
  secret: "adf32rkj32ljfdpf934jl2k4jfp9324",
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


mongoose.connect("mongodb://localhost/mtadb");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.use(flash());
app.use(function(req,res, next){
    res.locals.currentUser= req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//use routes
app.use(indexRoutes);
//app.use(uploadImageRoutes);
app.use("/blogs",blogRoutes);
app.use("/users",userRoutes);




// var blogs = [
//   {title: "TALES FROM THE ROAD", image:"http://www.child.com.au/resources/site/child/blog/blog-56-intro.jpg"},
//   {title: "LAKESHORE MAGNETIC FISHING SET", image:"http://www.child.com.au/resources/site/child/blog/blog-55-intro.jpg"},
//   {title: "SPEECH SOUNDS", image:"http://www.child.com.au/resources/site/child/blog/blog-54-intro.jpg"}
// ]


// //middleware
// var isLoggedIn = function(req, res, next){
//   if(req.isAuthenticated()){
//     return next();
//   }
//     res.redirect("/");
// };
//
//






app.listen(3000, function(){
  console.log("mta-cms-prototype server has started");
});
