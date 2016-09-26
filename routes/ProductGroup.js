var express = require('express');
var paginate = require('express-paginate');
var router = express.Router();



var middleware 	= require("../middleware");

router.use(paginate.middleware(10, 50));
router.get("/:group/",middleware.isProductReadOnly, function(req,res){
  var groupName= req.params.group;
  console.log(groupName);
  var ProductGroupModel = require("../models/product/"+groupName+".js");
  ProductGroupModel.paginate({},{page:req.query.page, limit:req.query.limit}, function( err, allItemsOfThisGroup, pageCount, itemCount){
    if(err){
      console.log(err);
    }else{
      var groupDisplayName = groupName.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })
       res.render("productgroup/index.ejs", { groupItems: allItemsOfThisGroup,
                                                  groupName: groupName,
                                                  groupDisplayName:groupDisplayName,
                                                  pageCount:pageCount,
                                                  itemCount:itemCount,
                                                  pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
                                                  });
    }
  });

});



router.get("/search/:groupName/", middleware.isProductReadOnly, function(req, res) {
  var key = req.query.key;
  var groupName = req.params.groupName;
  var ProductGroupModel = require("../models/product/"+groupName+".js");
  var groupDisplayName = groupName.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })

  var date1 = Date.now();

  ProductGroupModel.find({slug:key}).exec(function(err,found){
    if(found.length === 0 ){
      console.log("here here");
      ProductGroupModel.find({ $text: { $search : key}}, { score: { $meta: "textScore" } }).sort( { score: { $meta: "textScore" } } ).exec( function(err, allFoundItemsOfThisGroup) {
          if (err) {
              console.log(err);
          } else {
            console.log("here here here");
            var date2 = Date.now();
              var timeForSearch = date2 - date1;
              totalFound = allFoundItemsOfThisGroup.length;
              res.render("productgroup/index.ejs", {
                groupItems: allFoundItemsOfThisGroup,
                groupName: groupName,
                groupDisplayName:groupDisplayName,
                timeForSearch:timeForSearch,
                totalFound: totalFound
            });
          }
      });
    }else{

      var date2 = Date.now();
        var timeForSearch = date2 - date1;
      res.render("productgroup/index.ejs", {
          groupItems: found,
          groupName: groupName,
          groupDisplayName:groupDisplayName,
          timeForSearch:timeForSearch,
          totalFound:1
      });
    }
  });

});



router.post("/:groupName",middleware.isProductFullAccess, function(req, res){



  var groupName = req.params.groupName;
  console.log("xxxxxxxxxx");
  console.log(groupName);
  console.log("xxxxxxxxxx");
  var ProductGroupModel = require("../models/product/"+groupName+".js");

    var newGroupNameItem = {
          name: req.body.name,
      }

      ProductGroupModel.create(newGroupNameItem, function(err,newlyCreated){
        if(err){
          console.log("error");
          //console.log(err);
        }else{

        res.redirect("/productgroup/"+groupName);
      }
    })

});







router.get("/:groupName/new/", middleware.isProductFullAccess, function(req,res){
  var groupName =req.params.groupName;
  var groupDisplayName = groupName.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })


    res.render("productgroup/new.ejs", { groupName: groupName,
                                        groupDisplayName:groupDisplayName
                                      });
});

router.get("/:groupName/:groupItemId",middleware.isProductReadOnly, function(req,res){
  var groupName = req.params.groupName;
  var ProductGroupModel = require("../models/product/"+groupName+".js");
  var groupDisplayName = groupName.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })
  ProductGroupModel.findById(req.params.groupItemId).populate("products").exec(function(err, foundItem ){
    if(err){
        console.log(err);
    }else{
        res.render("/productgroup/"+groupName+"/show.ejs" ,{groupItemId : foundItem,
                                                            groupName : groupName,
                                                            groupDisplayName:groupDisplayName
                                                          });
    }
  })
});

module.exports = router;
