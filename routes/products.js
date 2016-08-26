
var express = require('express');
var router = express.Router();
//var methodOverride = require("method-override");
//router.use(methodOverride("_method"));
var Product = require("../models/product.js");

var middleware 	= require("../middleware");

var objMapToArr = require('object-map-to-array');

router.get("/",middleware.isProductReadOnly, function(req,res){
        Product.find({}, function(err, allProducts){
          if(err){

            console.log(err);
          }else{
            res.render("products/index.ejs", { products: allProducts});
          }
        });
});

router.post("/",middleware.isProductFullAccess, function(req, res){

//console.log(req.body);
debugger;
  var customAttributesArr =  objMapToArr(req.body.customAttributes, function ( n,k) {
  return { attributeName: k, attributeValue: n };
});
  console.log(req.body.customAttributes);
  console.log(customAttributesArr);
    var newProduct = {
          productName: req.body.name,
          productState: req.body.state,
          productPrice:req.body.price,
          productQuantity:req.body.quantity,
          productMainImage:req.body.mainImage,
          productAdditionalImage01:req.body.additionalImage01,
          productAdditionalImage02:req.body.additionalImage02,
          productAdditionalImage03:req.body.additionalImage03,
          productContentDescription: req.body.contentDescription,
          productCustomAttributes: customAttributesArr
      }
      Product.create(newProduct, function(err,newlyCreated){
        if(err){

          console.log(err);
        }else{

        res.redirect("/products")
      }
    })

});

router.get("/new", middleware.isProductFullAccess, function(req,res){
    res.render("products/new.ejs")
});

router.get("/:id",middleware.isProductReadOnly, function(req,res){
  Product.findById(req.params.id, function(err, foundProduct ){
    if(err){
        console.log(err);
    }else{
        res.render("products/show.ejs" ,{product : foundProduct})
    }
  })
});

router.get("/:id/edit", middleware.isProductFullAccess, function(req, res){

  Product.findById(req.params.id, function(err, foundProduct){
    if(err){
      console.log(err);
    }else{
      res.render("products/edit.ejs", {product: foundProduct});
    }
  })
});

router.put("/:id", middleware.isProductFullAccess, function(req, res){
console.log("test etstestesteste");



var updatingProduct = {
      productName: req.body.name,
      productState: req.body.state,
      productPrice:req.body.price,
      productQuantity:req.body.quantity,
      productMainImage:req.body.mainImage,
      productAdditionalImage01:req.body.additionalImage01,
      productAdditionalImage02:req.body.additionalImage02,
      productAdditionalImage03:req.body.additionalImage03,
      productContentDescription: req.body.contentDescription
  }

  Product.findByIdAndUpdate(req.params.id, updatingProduct, function(err, updatedProduct){
      if(err){
        console.log(err);
      }else{
        res.redirect("/products/"+req.params.id);
      }
  });
});

router.delete("/:id", middleware.isProductFullAccess, function(req, res){
  Product.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/products")
    }
  });
});

module.exports = router;
