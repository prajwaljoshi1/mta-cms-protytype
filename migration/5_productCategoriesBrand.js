
var express = require("express");
var fs = require('fs');
var tempStorage1= 'temp1.json';
var jsonfile = require('jsonfile');

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/mtadb");

var CATEGORY = 'Brand';
var Product = require("../models/product/product.js");
var MODEL = require("../models/product/product"+CATEGORY+".js");





var file = 'temp1.json'
jsonfile.readFile(file, function(err, obj) {
  obj.forEach(function(category){


    var newCategoryItem = {
        slug:category.slug,
        productBrandName: category.name,                                                                                                   //change here
        products: category.products
    }




    MODEL.create(newCategoryItem, function(err, newlyCreatedCategory) {
        if (err) {

            console.log(err);
        } else {

            //console.log("Category Created ", newlyCreatedCategory.productCategoryName);

            category.products.forEach(function(productId){

                    Product.findById(productId, function(err , product){

                      var updatingProduct = product;
                       updatingProduct.productBrands.push({
                           id: newlyCreatedCategory._id,
                           brand:newlyCreatedCategory.productBrandName                                                                                /// change here
                      });


                         Product.findByIdAndUpdate(product._id, updatingProduct, function(err, updatedProduct) {
                           if(err){
                             console.log(err);
                           }else{
                             console.log("product added " , updatedProduct.slug , " to ", newlyCreatedCategory.slug);
                           }
                         });

                    });

            });
        }
    });




  })
})
