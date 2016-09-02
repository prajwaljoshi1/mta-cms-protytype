var express = require('express');
var paginate = require('express-paginate');

var router = express.Router();

var User = require("../models/user.js")

var middleware 	= require("../middleware");

router.use(paginate.middleware(10, 50));
router.get("/",middleware.isAdmin, function(req,res){

    User.paginate({},{page:req.query.page, limit:req.query.limit}, function( err, allUsers, pageCount, itemCount){
      if(err){
        console.log(err);
      }else{
        console.log("boom");
        console.log(paginate);
         res.render("users/index.ejs", { users: allUsers,
                                          pageCount:pageCount,
                                         itemCount:itemCount,
                                         pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
                                        });
      }
    })
        // User.find({}, function(err, allUsers){
        //   if(err){
        //     console.log(err);
        //   }else{
        //     res.render("users/index.ejs", { users: allUsers});
        //   }
        // });
});


module.exports = router;
