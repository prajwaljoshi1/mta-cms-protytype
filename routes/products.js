var express = require('express');
var paginate = require('express-paginate');
var router = express.Router({
    mergeParams: true
});

var ProductCategory = require("../models/product/productCategory.js");
var Product = require("../models/product/product.js");

var ProductBrand = require("../models/product/productBrand.js");
var ProductAuthor = require("../models/product/productAuthor.js");


var middleware = require("../middleware");

var objMapToArr = require('object-map-to-array');


var aws = require('aws-sdk')
var multer = require('multer');

var s3 = new aws.S3({});
var multerS3 = require('multer-s3');

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


var uploadIndexes = [];
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
    Products.paginate({}, {
        page: req.query.page,
        limit: req.query.limit
    }, function(err, allProducts, pageCount, itemCount) {
        if (err) {
            console.log(err);
        } else {
            res.render("products/index.ejs", {
                products: allProducts,
                pageCount: pageCount,
                itemCount: itemCount,
                pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
            });
        }
    });
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

router.post("/", [middleware.isProductFullAccess, uploadNew.any()], function(req, res) {

    var customAttributesArr = objMapToArr(req.body.customAttributes, function(n, k) {
        return {
            attributeName: k,
            attributeValue: n
        };
    });



    var productBrandArr = req.body.brand || [];
    productBrandArr = productBrandArr.map(function(value) {
        return JSON.parse(value);
    });


    var productAuthorArr = req.body.author || [];
    productAuthorArr = productAuthorArr.map(function(value) {
        return JSON.parse(value);
    });

    var newProduct = {
        productName: req.body.name,
        productState: req.body.state,
        productPrice: req.body.price,
        productQuantity: req.body.quantity,
        productContentDescription: req.body.contentDescription,
        productCustomAttributes: customAttributesArr,
        productCategory: req.params.categoryId,
        productBrand: productBrandArr,
        productAuthor: productAuthorArr
    }




    var imageOrder = req.body.imageOrder || [];

    if (imageOrder.length === 0) {
        imageOrder = s3FileNames.map(function(item, key) {
            return key; //make default imageorder based on number of files
        });
    } else {
        imageOrder = imageOrder.split(',').map(function(item) {
            return parseInt(item, 10);
        }); //convert back to array and all elements to int
    }


    var arr = [];

    s3FileNames.forEach(function(fileName, key) {
        arr.push("https://s3.amazonaws.com/mtacmsblog/" + s3FileNames[imageOrder[key]]);
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
                    //product brand     //similar in  all categories

                    productBrandArr.forEach(function(brand) {
                        var brandId = brand.id;
                        ProductBrand.findById(brandId, function(err, productBrand) {
                            if (err) {
                                console.log(err);
                            } else {
                                productBrand.products.push(newlyCreated);
                                productBrand.save();
                            }
                        });
                    });
                    //product Author
                    productAuthorArr.forEach(function(author) {
                        var authorId = author.id;
                        ProductAuthor.findById(authorId, function(err, productAuthor) {
                            if (err) {
                                console.log(err);
                            } else {
                                productAuthor.products.push(newlyCreated);
                                productAuthor.save();
                            }
                        });
                    });

                    req.flash('success', "Successfully add a new " + productCategory.productCategoryName + ".");
                    res.redirect("/productcategories/" + req.params.categoryId + "/products/" + newlyCreated._id);
                }
            })

        }
    });


});

router.get("/new", [middleware.isProductFullAccess, middleware.getEachCategoryObjects], function(req, res) {

    console.log("request", req.brandList);
    ProductCategory.findById(req.params.categoryId, function(err, productCategory) {
        if (err) {
            console.log(err);
        } else {

            res.render("products/new.ejs", {
                productCategory: productCategory,
                brandList: req.brandList,
                authorList: req.authorList
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
                productCategoryId: req.params.categoryId
            });
        }
    });
});

router.get("/:productId/edit", [middleware.isProductFullAccess, middleware.getEachCategoryObjects], function(req, res) {
    console.log(req.body);
    Product.findById(req.params.productId, function(err, foundProduct) {
        if (err) {
            console.log(err);
        } else {
            res.render("products/edit.ejs", {
                productCategoryId: req.params.categoryId,
                product: foundProduct,
                brandList: req.brandList,
                authorList: req.authorList

            });
        }
    })
});

router.put("/:productId", [middleware.isProductFullAccess, uploadEdit.any() , middleware.getProductDetails], function(req, res) {

    var removedBrands = req.body.removedBrands;

    var customAttributesArr = objMapToArr(req.body.customAttributes, function(n, k) {
        return {
            attributeName: k,
            attributeValue: n
        };
    });

    var productBrandArr = req.productDetails.productBrand || [];
    var productAuthorArr = req.productDetails.productAuthor  || [];

    //take off productcategories (if any)


    if (removedBrands) {
      console.log("LENGTH 1: ", productBrandArr.length);
      removedBrands.forEach(function(brandId){
            productBrandArr = productBrandArr.filter(function(array) { return array.id !== brandId });
          });
    }
    console.log("LENGTH 2: ", productBrandArr.length);






    // add new productcategories (if any)

   var   newProductBrandArr = req.body.brand || [];
    if(newProductBrandArr.length > 0){
      newProductBrandArr = newProductBrandArr.map(function(value) {
          return JSON.parse(value);
      });
      productBrandArr = productBrandArr.concat(newProductBrandArr);

    }



    var newProductAuthorArr = req.body.author  || [];
    if(newProductAuthorArr.length > 0 ){
      newProductAuthorArr = newProductAuthorArr.map(function(value) {
          return JSON.parse(value);
      });
        productAuthorArr = productAuthorArr.concat(newProductAuthorArr);
    }






    var updatingProduct = {
        productName: req.body.name,
        productState: req.body.state,
        productPrice: req.body.price,
        productQuantity: req.body.quantity,
        productContentDescription: req.body.contentDescription,
        productCustomAttributes: customAttributesArr,
        productBrand: productBrandArr,
        productAuthor: productAuthorArr
    }


    var imageOrder = req.body.imageOrder || "0,1,2,3,4,5"; // if image unchanged
    var arr = [];
    if (imageOrder.length > 0) {

        imageOrder = imageOrder.split(',').map(function(item) {
            return parseInt(item, 10);
        }); //convert back to array and all elements to int


        // code to re-order images
        var imageUrl = req.body.imageUrl;

        if (imageUrl) {

            imageOrder.forEach(function(val) {
                if (imageUrl[val]) {

                    arr.push(imageUrl[val]);
                }
            });

        }


    }

    //uploadedIndexes
    if (uploadIndexes.length > 0) {
        uploadIndexes.forEach(function(val, key) {
            arr[val] = "https://s3.amazonaws.com/mtacmsblog/" + s3FileNames[key];
        })

        console.log(arr);
    }
    uploadIndexes = []; //cleanup
    s3FileNames = [];

    //console.log(arr);
    updatingProduct.productImages = arr;

    Product.findByIdAndUpdate(req.params.productId, updatingProduct, function(err, updatedProduct) {
        if (err) {
            console.log(err);
        } else {

            // add updated product to categories

            //product brand     //similar in  all categories

            newProductBrandArr.forEach(function(brand) {
                var brandId = brand.id;
                ProductBrand.findById(brandId, function(err, productBrand) {
                    if (err) {
                        console.log(err);
                    } else {
                        productBrand.products.push(updatedProduct);
                        productBrand.save();

                    }
                });
            });

            //delete  Product form  removed brand
            if (removedBrands) {
              removedBrands.forEach(function(brandId){
                ProductBrand.findById(brandId, function(err, productBrand) {
                    if (err) {
                        console.log(err);
                    } else {
                        productBrand.products.pull(updatedProduct);
                        productBrand.save();

                    }
                });
              });
            }

            //product Author
            newProductAuthorArr.forEach(function(author) {
                var authorId = author.id;
                ProductAuthor.findById(authorId, function(err, productAuthor) {
                    if (err) {
                        console.log(err);
                    } else {
                        productAuthor.products.push(updatedProduct);
                        productAuthor.save();
                    }
                });
            });








            res.redirect("/productcategories/" + req.params.categoryId + "/products/" + req.params.productId);

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
    //delete product from each category as well






});

module.exports = router;
