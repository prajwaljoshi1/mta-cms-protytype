
var express = require("express");
var fs = require('fs');
var tempStorage1= 'temp1.json';
var jsonfile = require('jsonfile');

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/mtadb");

var CATEGORY = 'Category';
var Product = require("../models/product/product.js");
var MODEL = require("../models/product/product"+CATEGORY+".js");





var file = 'temp1.json'
jsonfile.readFile(file, function(err, obj) {
  obj.forEach(function(category){


    var newCategoryItem = {
        slug:category.slug,
        name: category.name,                                                                                                   //change here
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
                       updatingProduct.productCategories.push({                                                                                             /// change here
                           id: newlyCreatedCategory._id,
                           name:newlyCreatedCategory.name                                                                                /// change here
                      });


                         Product.findByIdAndUpdate(product._id, updatingProduct, function(err, updatedProduct) {
                           if(err){
                             console.log(err);
                           }else{
                             console.log("product added " , updatedProduct.slug );
                           }
                         });

                    });

            });
        }
    });




  })
})
