var express = require('express');
var paginate = require('express-paginate');
var router = express.Router();

var ProductAuthor = require("../models/product/productAuthor.js");

var middleware 	= require("../middleware");

router.use(paginate.middleware(10, 50));
router.get("/",middleware.isProductReadOnly, function(req,res){
  ProductAuthor.paginate({},{page:req.query.page, limit:req.query.limit}, function( err, allProductAuthors, pageCount, itemCount){
    if(err){
      console.log(err);
    }else{
       res.render("productauthors/index.ejs", { productAuthors: allProductAuthors,
                                        pageCount:pageCount,
                                       itemCount:itemCount,
                                       pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
                                      });
    }
  });

});

router.post("/",middleware.isProductFullAccess, function(req, res){


    var newProductAuthor = {
          productAuthorName: req.body.name,
      }

      ProductAuthor.create(newProductAuthor, function(err,newlyCreated){
        if(err){

          console.log(err);
        }else{

        res.redirect("/productAuthors")
      }
    })

});

router.get("/new", middleware.isProductFullAccess, function(req,res){
    res.render("productauthors/new.ejs")
});

router.get("/:authorId",middleware.isProductReadOnly, function(req,res){
  ProductAuthor.findById(req.params.authorId).populate("products").exec(function(err, foundProductAuthor ){
    if(err){
        console.log(err);
    }else{
        res.render("productauthors/show.ejs" ,{productAuthor : foundProductAuthor});
    }
  })
});



module.exports = router;
