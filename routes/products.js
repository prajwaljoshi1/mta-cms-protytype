var express = require('express');
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
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'mtacmsproducts',
        secretAccessKey: 'Go to hell',
        accessKeyId: 'Go to hell',
        acl: 'public-read',
        key: function(req, file, cb) {
            var fileName = Date.now() + "_" + req.body.title + "_" + file.originalname;
            s3FileNames.push(fileName)
            cb(null, fileName);
        }
    })
})


router.get("/", middleware.isProductReadOnly, function(req, res) {
    Product.find({}, function(err, allProducts) {
        if (err) {

            console.log(err);
        } else {
            res.render("products/index.ejs", {
                products: allProducts
            });
        }
    });
});

router.post("/", [middleware.isProductFullAccess,  upload.any()], function(req, res) {


    var customAttributesArr = objMapToArr(req.body.customAttributes, function(n, k) {
        return {
            attributeName: k,
            attributeValue: n
        };
    });


    var imageOrder = req.body.imageOrder;
    console.log(imageOrder);
        imageOrder = imageOrder.split(',').map(function(item) {
    return parseInt(item, 10);
}); //convert back to array and all elements to int


    var newProduct = {
        productName: req.body.name,
        productState: req.body.state,
        productPrice: req.body.price,
        productQuantity: req.body.quantity,
        productContentDescription: req.body.contentDescription,
        productCustomAttributes: customAttributesArr
    }

    newProduct.productMainImage = "https://s3.amazonaws.com/mtacmsproducts/"+s3FileNames[imageOrder[0]],
    newProduct.productAdditionalImage01 = "https://s3.amazonaws.com/mtacmsproducts/"+s3FileNames[imageOrder[1]];
    newProduct.productAdditionalImage02 = "https://s3.amazonaws.com/mtacmsproducts/"+s3FileNames[imageOrder[2]];
    newProduct.productAdditionalImage03 = "https://s3.amazonaws.com/mtacmsproducts/"+s3FileNames[imageOrder[3]];

    ProductCategory.findById(req.params.id, function(err, productCategory) {
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
                    res.redirect("/productCategories/");
                }
            })

        }
    });


});

router.get("/new", middleware.isProductFullAccess, function(req, res) {
    ProductCategory.findById(req.params.id, function(err, productCategory) {
        if (err) {
            console.log(err);
        } else {

            res.render("products/new.ejs", {
                productCategory: productCategory
            });
        }
    })

});

router.get("/:id", middleware.isProductReadOnly, function(req, res) {
    Product.findById(req.params.id, function(err, foundProduct) {
        if (err) {
            console.log(err);
        } else {
            res.render("products/show.ejs", {
                product: foundProduct
            })
        }
    })
});

router.get("/:id/edit", middleware.isProductFullAccess, function(req, res) {

    Product.findById(req.params.id, function(err, foundProduct) {
        if (err) {
            console.log(err);
        } else {
            res.render("products/edit.ejs", {
                product: foundProduct
            });
        }
    })
});

router.put("/:id", middleware.isProductFullAccess, function(req, res) {
    console.log("test etstestesteste");


    var updatingProduct = {
        productName: req.body.name,
        productState: req.body.state,
        productPrice: req.body.price,
        productQuantity: req.body.quantity,
        productMainImage: req.body.mainImage,
        productAdditionalImage01: req.body.additionalImage01,
        productAdditionalImage02: req.body.additionalImage02,
        productAdditionalImage03: req.body.additionalImage03,
        productContentDescription: req.body.contentDescription
    }

    Product.findByIdAndUpdate(req.params.id, updatingProduct, function(err, updatedProduct) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/products/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.isProductFullAccess, function(req, res) {
    Product.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/products")
        }
    });
});

module.exports = router;
