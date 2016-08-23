var express = require('express');
var router = express.Router();

var User = require("../models/user.js")

var middleware 	= require("../middleware");


router.get("/",middleware.isAdmin, function(req,res){
        User.find({}, function(err, allUsers){
          if(err){
            console.log(err);
          }else{
            res.render("users/index.ejs", { users: allUsers});
          }
        });
});


module.exports = router;
