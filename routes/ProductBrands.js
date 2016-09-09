var express = require('express');
var paginate = require('express-paginate');
var router = express.Router();

var ProductBrand = require("../models/product/productBrand.js");

var middleware 	= require("../middleware");

//var objMapToArr = require('object-map-to-array');
router.use(paginate.middleware(10, 50));
router.get("/",middleware.isProductReadOnly, function(req,res){
  ProductBrand.paginate({},{page:req.query.page, limit:req.query.limit}, function( err, allProductBrands, pageCount, itemCount){
    if(err){
      console.log(err);
    }else{
       res.render("productbrands/index.ejs", { productBrands: allProductBrands,
                                        pageCount:pageCount,
                                       itemCount:itemCount,
                                       pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
                                      });
    }
  });

});

router.post("/",middleware.isProductFullAccess, function(req, res){

//console.log(req.body);

//   var customAttributesArr =  objMapToArr(req.body.customAttributes, function ( n,k) {
//   return { attributeName: k, attributeValue: n };
// });

    var newProductBrand = {
          productBrandName: req.body.name,
      }

      ProductBrand.create(newProductBrand, function(err,newlyCreated){
        if(err){

          console.log(err);
        }else{

        res.redirect("/productBrands")
      }
    })

});

router.get("/new", middleware.isProductFullAccess, function(req,res){
    res.render("productbrands/new.ejs")
});

router.get("/:brandId",middleware.isProductReadOnly, function(req,res){
  ProductBrand.findById(req.params.brandId).populate("products").exec(function(err, foundProductBrand ){
    if(err){
        console.log(err);
    }else{
        res.render("productbrands/show.ejs" ,{productBrand : foundProductBrand})
    }
  })
});



module.exports = router;
