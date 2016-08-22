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
router.get("/register", function(req, res){
 res.render('register');
});

//post register form
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  var password = req.body.password
  User.register(newUser, password, function(err, user){
      if(err){
         req.flash("error", err.message);
         return res.render("register");
     }
     passport.authenticate("local")(req, res, function(){
       res.redirect("/home")
     });
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
