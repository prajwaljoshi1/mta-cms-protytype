
var express = require('express');
var router = express.Router();

var ProductCategory = require("../models/productCategory.js");

var middleware 	= require("../middleware");

//var objMapToArr = require('object-map-to-array');

router.get("/",middleware.isProductReadOnly, function(req,res){
        ProductCategory.find({}, function(err, allProductCategories){
          if(err){

            console.log(err);
          }else{
            res.render("productcategories/index.ejs", { productCategories: allProductCategories});
          }
        });
});

router.post("/",middleware.isProductFullAccess, function(req, res){

//console.log(req.body);

//   var customAttributesArr =  objMapToArr(req.body.customAttributes, function ( n,k) {
//   return { attributeName: k, attributeValue: n };
// });

    var newProductCategory = {
          productCategoryName: req.body.name,
          productCategoryAdditionalFields:req.body.fields
      }

      ProductCategory.create(newProductCategory, function(err,newlyCreated){
        if(err){

          console.log(err);
        }else{

        res.redirect("/productcategories")
      }
    })

});

router.get("/new", middleware.isProductFullAccess, function(req,res){
    res.render("productcategories/new.ejs")
});

router.get("/:id",middleware.isProductReadOnly, function(req,res){
  ProductCategory.findById(req.params.id).populate("products").exec(function(err, foundProductCategory ){
    if(err){
        console.log(err);
    }else{
        res.render("productcategories/show.ejs" ,{productCategory : foundProductCategory})
    }
  })
});

// router.get("/:id/edit", middleware.isProductFullAccess, function(req, res){
//
//   Product.findById(req.params.id, function(err, foundProduct){
//     if(err){
//       console.log(err);
//     }else{
//       res.render("products/edit.ejs", {product: foundProduct});
//     }
//   })
// });
//
// router.put("/:id", middleware.isProductFullAccess, function(req, res){
// console.log("test etstestesteste");
//
//
//
// var updatingProduct = {
//       productName: req.body.name,
//       productState: req.body.state,
//       productPrice:req.body.price,
//       productQuantity:req.body.quantity,
//       productMainImage:req.body.mainImage,
//       productAdditionalImage01:req.body.additionalImage01,
//       productAdditionalImage02:req.body.additionalImage02,
//       productAdditionalImage03:req.body.additionalImage03,
//       productContentDescription: req.body.contentDescription
//   }
//
//   Product.findByIdAndUpdate(req.params.id, updatingProduct, function(err, updatedProduct){
//       if(err){
//         console.log(err);
//       }else{
//         res.redirect("/products/"+req.params.id);
//       }
//   });
// });
//
// router.delete("/:id", middleware.isProductFullAccess, function(req, res){
//   Product.findByIdAndRemove(req.params.id, function(err){
//     if(err){
//       console.log(err);
//     }else{
//       res.redirect("/products")
//     }
//   });
// });

module.exports = router;
