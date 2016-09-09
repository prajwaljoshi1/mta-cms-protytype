var express = require('express');
var router = express.Router();
var Blog = require("../models/blog.js");
var ProductCategory = require("../models/product/productCategory.js");
var Product = require("../models/product/product.js");

var searchIndex = require('search-index');
 //var si = require('search-index')({indexPath: 'testindex', logLevel: 'info'});




module.exports = router;

//get get a blog with id
// api/blog/:id


router.get("/blog/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            var date1 = Date.now();
            //console.log(date1);
            res.json({
                blog: foundBlog
            });
            var date2 = Date.now();
            console.log(" API Call Time Taken: ", date2 - date1, "ms");
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
            res.json({
                product: foundProduct
            });
            var date2 = Date.now();
            console.log("API Call Time Taken: ", date2 - date1, "ms");
        }
    })
});


router.get("/search/product/:slug", function(req, res) {
  var date1 = Date.now();
    Product.find({}, function(err, allProducts) {
        if (err) {

            console.log(err);
        } else {

            var searchKey = req.params.slug;

            searchIndex({}, function(err, si){
              if(err) console.log("ERROR searchIndex");
                 si.add([{'allProducts':'test'}, {'batman':'test'}], {}, function(err) {
                   if (!err) console.log('success!');
                   else{
                     console.log("failure");
                   }
                  });

                      var q = {};
                      q.query = {
                          AND: {
                              '*': [searchKey]
                          }
                      }
                      si.search(q, function(err, searchResults) {
                        if(err){
                          res.json({
                              product: err
                          });
                        }else{
                          res.json({
                              product: searchResults
                          });
                        }

                          //console.log(searchResults);
                          var date2 = Date.now();
                          console.log("API Call Time Taken: ", date2 - date1, "ms");
                      });



           });



        }
    });
});
