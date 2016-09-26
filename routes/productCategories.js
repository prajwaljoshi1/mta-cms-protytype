
var express = require('express');
var paginate = require('express-paginate');
var router = express.Router();

var ProductCategory = require("../models/product/productCategory.js");

var middleware 	= require("../middleware");

//var objMapToArr = require('object-map-to-array');
router.use(paginate.middleware(20, 50));
router.get("/",middleware.isProductReadOnly, function(req,res){
  ProductCategory.paginate({},{page:req.query.page, limit:req.query.limit}, function( err, allProductCategories, pageCount, itemCount){
    if(err){
      console.log(err);
    }else{
       res.render("productcategories/index.ejs", { productCategories: allProductCategories,
                                        pageCount:pageCount,
                                       itemCount:itemCount,
                                       pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
                                      });
    }
  })
        // ProductCategory.find({}, function(err, allProductCategories){
        //   if(err){
        //
        //     console.log(err);
        //   }else{
        //     res.render("productcategories/index.ejs", { productCategories: allProductCategories});
        //   }
        // });
});



router.get("/search/", middleware.isProductReadOnly, function(req, res) {
  key = req.query.key;
  var date1 = Date.now();

  ProductCategory.find({slug:key}).exec(function(err,found){
    if(found.length === 0 ){
      ProductCategory.find({ $text: { $search : key}}, { score: { $meta: "textScore" } }).sort( { score: { $meta: "textScore" } } ).exec( function(err, foundCategories) {
          if (err) {
              console.log(err);
          } else {
            var date2 = Date.now();
              var timeForSearch = date2 - date1;
              totalFound = foundCategories.length;
            res.render("productcategories/index.ejs", {
                productCategories: foundCategories,
                timeForSearch:timeForSearch,
                totalFound: totalFound
            });
          }
      });
    }else{
      var date2 = Date.now();
        var timeForSearch = date2 - date1;
      res.render("productcategories/index.ejs", {
          productCategories: found,
          timeForSearch:timeForSearch,
          totalFound:1
      });
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

router.get("/:categoryId",middleware.isProductReadOnly, function(req,res){
  ProductCategory.findById(req.params.categoryId).populate("products").exec(function(err, foundProductCategory ){
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
