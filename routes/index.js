var express = require('express');
var router = express.Router();

var passport = require('passport');

var User = require("../models/user.js");

//middleware
var isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
    res.redirect("/");
};

//homepage
router.get("/home", isLoggedIn, function(req,res){
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
       console.log(err);
       return res.render("register");
     }
     passport.authenticate("local")(req, res, function(){
       res.redirect("/home")
     });
  });
});

//show login form
router.get("/", function(req, res){
 res.render('login');
});


//post logindetails and authenticate
router.post("/", passport.authenticate("local",
                                    {
                                      successRedirect: "/home",
                                      failureRedirect: "/"
                                    }),
                                    function(req,res ){

                                    });



  router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
    });




    module.exports = router;
