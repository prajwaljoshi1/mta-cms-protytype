
var express = require('express');
var router = express.Router();
var Blog = require("../models/blog.js");
var ProductCategory = require("../models/product/productCategory.js");

var Product = require('../models/product/product.js');


//slug


//product slug




router.get("/productslug", function(req, res) {
Product.find({}, function(err, allProduct) {
    if (err) {
        console.log(err);
    } else {

      slugList =[];

      allProduct.forEach(function(product){
          slugList.push(product.slug)
      });
      res.json({
          productSlugs: slugList
      });

    }
});
});


module.exports = router;
