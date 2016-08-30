var express = require('express');
var router = express.Router();

var passport = require('passport');

var User = require("../models/user.js");

var middleware 	= require("../middleware");

// //middleware
// var isLoggedIn = function(req, res, next){
//   if(req.isAuthenticated()){
//     return next();
//
//   }
//     req.flash("error", "You need to be logged in to do this");
//     res.redirect("/");
// };

//homepage
router.get("/home", middleware.isLoggedIn, function(req,res){
        res.render("cmshome.ejs");
});


//show register form
router.get("/register",middleware.isAdmin, function(req, res){
 res.render('register');
});

//post register form
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  var password = req.body.password;
  var userType = req.body.userType;
  User.register(newUser, password, function(err, user){
      if(err){
         req.flash("error", err.message);
         return res.render("register");
     }
     //user.userType = userType;
     console.log(req .body);
     debugger;
     var upsertData = {userType : userType}
     User.findByIdAndUpdate(user._id,upsertData, function(err,user){
       if(err){
         console.log(err);
       }else{
         req.flash("success", "New User Created");
         res.redirect("/cmshome");
       }
     } );


  });
});

//show login form
router.get("/", function(req, res){
 res.render('login.ejs');
});


//post logindetails and authenticate
router.post("/", passport.authenticate("local",
                                    {
                                      successRedirect: "/home",
                                      failureRedirect: "/",
                                      failureFlash: true
                                    }),
                                    function(req,res ){
                                      req.flash("error", "You need to be logged in to do this");
                                    });



  router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
    });




    module.exports = router;
