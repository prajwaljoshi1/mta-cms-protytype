var express = require('express');
var router = express.Router();
var Blog = require("../models/blog.js");
var ProductCategory = require("../models/productCategory.js");
var Product = require("../models/product.js");





module.exports = router;

//get get a blog with id
// api/blog/:id


router.get("/blog/:id", function(req,res){
  Blog.findById(req.params.id, function(err, foundBlog ){
    if(err){
        console.log(err);
    }else{
       var date1 = Date.now();
       //console.log(date1);
        res.json({blog : foundBlog});
        var date2 =Date.now();
        console.log(" API Call Time Taken: ", date2 - date1,"ms");
    }
  })
});


//get get a product with id
// api/product/:id

router.get("/product/:id", function(req, res) {
    Product.findById(req.params.id, function(err, foundProduct) {
        if (err) {

            console.log(err);
        } else {
           var date1 = Date.now();
            res.json({product: foundProduct});
            var date2 =Date.now();
            console.log("API Call Time Taken: ", date2 - date1,"ms");
        }
    })
});
