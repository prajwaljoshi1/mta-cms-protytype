var express = require('express');
var paginate = require('express-paginate');
var router = express.Router({
    mergeParams: true
});
//var methodOverride = require("method-override");
//router.use(methodOverride("_method"));
var ProductCategory = require("../models/productCategory.js");
var Product = require("../models/product.js");


var middleware = require("../middleware");

var objMapToArr = require('object-map-to-array');


var aws = require('aws-sdk')
var multer = require('multer');

var s3 = new aws.S3({});
var multerS3 = require('multer-s3')

var s3FileNames = [];
var uploadNew = multer({
    storage: multerS3({
        s3: s3,
        key: 'go to hell',
        secret: 'go to hell//',
        bucket: 'mtacmsblog',
        acl: 'public-read',
        key: function(req, file, cb) {


            var fileName = Date.now() + "_" + req.body.title + "_" + file.originalname;
            s3FileNames.push(fileName)
            cb(null, fileName);
        }
    })
})


var uploadIndexes =[];
var uploadEdit = multer({
    storage: multerS3({
        s3: s3,
        key: 'go to hell',
        secret: 'go to hell',
        bucket: 'mtacmsblog',
        acl: 'public-read',
        key: function(req, file, cb) {
            uploadIndexes.push(parseInt(file.fieldname));

            var fileName = Date.now() + "_" + req.body.title + "_" + file.originalname;
            s3FileNames.push(fileName)
            cb(null, fileName);
        }
    })
})


router.use(paginate.middleware(10, 50));
router.get("/", middleware.isProductReadOnly, function(req, res) {
  Products.paginate({},{page:req.query.page, limit:req.query.limit}, function( err, allProducts, pageCount, itemCount){
    if(err){
      console.log(err);
    }else{

       res.render("products/index.ejs", { products: allProducts,
                                        pageCount:pageCount,
                                       itemCount:itemCount,
                                       pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
                                      });
    }
  })
    // Product.find({}, function(err, allProducts) {
    //     if (err) {
    //
    //         console.log(err);
    //     } else {
    //         res.render("products/index.ejs", {
    //             products: allProducts
    //         });
    //     }
    // });
});

router.post("/", [middleware.isProductFullAccess,  uploadNew.any()], function(req, res) {

    var customAttributesArr = objMapToArr(req.body.customAttributes, function(n, k) {
        return {
            attributeName: k,
            attributeValue: n
        };
    });



        var newProduct = {
            productName: req.body.name,
            productState: req.body.state,
            productPrice: req.body.price,
            productQuantity: req.body.quantity,
            productContentDescription: req.body.contentDescription,
            productCustomAttributes: customAttributesArr,
            productCategory:req.params.categoryId
        }




    var imageOrder = req.body.imageOrder || [];

    if(imageOrder.length === 0){
      imageOrder = s3FileNames.map(function(item,key){
        return key;  //make default imageorder based on number of files
      });
    }else{
      imageOrder = imageOrder.split(',').map(function(item) {
      return parseInt(item, 10);
      }); //convert back to array and all elements to int
    }


    var arr =  [];

    s3FileNames.forEach(function(fileName,key){
        arr.push("https://s3.amazonaws.com/mtacmsblog/"+s3FileNames[imageOrder[key]]);
    });

    newProduct.productImages = arr;

    ProductCategory.findById(req.params.categoryId, function(err, productCategory) {
        if (err) {
            req.flash("error", "something went wrong");
            console.log(err);
        } else {

            Product.create(newProduct, function(err, newlyCreated) {
                if (err) {
                    req.flash("error", "something went wrong");
                    console.log(err);
                } else {
                    newlyCreated.save();
                    productCategory.products.push(newlyCreated);
                    productCategory.save();
                    req.flash('success', "Successfully add a new " + productCategory.productCategoryName + ".");
                    res.redirect("/productcategories/"+req.params.categoryId+"products"+newlyCreated._id);
                }
            })

        }
    });


});

router.get("/new", middleware.isProductFullAccess, function(req, res) {
    ProductCategory.findById(req.params.categoryId, function(err, productCategory) {
        if (err) {
            console.log(err);
        } else {

            res.render("products/new.ejs", {
                productCategory: productCategory
            });
        }
    })

});

router.get("/:productId", middleware.isProductReadOnly, function(req, res) {
    Product.findById(req.params.productId, function(err, foundProduct) {
      console.log(req.params);
        if (err) {
            console.log(err);
        } else {
            res.render("products/show.ejs", {
                product: foundProduct,
                productCategoryId:req.params.categoryId
            })
        }
    })
});

router.get("/:productId/edit", middleware.isProductFullAccess, function(req, res) {

    Product.findById(req.params.productId, function(err, foundProduct) {
        if (err) {
            console.log(err);
        } else {
            res.render("products/edit.ejs", {
                productCategoryId: req.params.categoryId,
                product: foundProduct
            });
        }
    })
});

router.put("/:productId",[ middleware.isProductFullAccess,uploadEdit.any()], function(req, res) {
    // console.log("test etstestesteste");
    console.log(req.body);

    var customAttributesArr = objMapToArr(req.body.customAttributes, function(n, k) {
        return {
            attributeName: k,
            attributeValue: n
        };
    });


    var updatingProduct = {
        productName: req.body.name,
        productState: req.body.state,
        productPrice: req.body.price,
        productQuantity: req.body.quantity,
        productContentDescription: req.body.contentDescription,
        productCustomAttributes: customAttributesArr
    }


    var imageOrder = req.body.imageOrder || "0,1,2,3,4,5"; // if image unchanged
    var arr =  [];
    if(imageOrder.length > 0){

      imageOrder = imageOrder.split(',').map(function(item) {
      return parseInt(item, 10);
      }); //convert back to array and all elements to int


      // code to re-order images
      var imageUrl = req.body.imageUrl;

      imageOrder.forEach(function(val){
        if(imageUrl[val]){

          arr.push(imageUrl[val]);
        }
      });

    }

    //uploadedIndexes
    console.log(  arr);
    if(uploadIndexes.length > 0){
      uploadIndexes.forEach(function(val,key){
          arr[val] = "https://s3.amazonaws.com/mtacmsblog/"+s3FileNames[key];
      })

      console.log(arr);
    }
    uploadIndexes=[];  //cleanup
    s3FileNames=[];

    //console.log(arr);
    updatingProduct.productImages = arr;

    Product.findByIdAndUpdate(req.params.productId, updatingProduct, function(err, updatedProduct) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/productcategories/"+req.params.categoryId+"/products/" + req.params.productId);
        }
    });
});

router.delete("/:productId", middleware.isProductFullAccess, function(req, res) {
    Product.findByIdAndRemove(req.params.ProductId, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/products")
        }
    });
});

module.exports = router;
