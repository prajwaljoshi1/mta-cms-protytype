
var express = require('express');
var router = express.Router();
var Blog = require("../models/blog.js")
var aws = require('aws-sdk')
 var multer = require('multer');

var s3 = new aws.S3({});
var multerS3 = require('multer-s3')

var s3FileNames = [];
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'mtacmsblog',
    secretAccessKey: 'Go to hell',
    accessKeyId: 'Go to hell',
    acl: 'public-read',
    key: function (req, file, cb) {
        var fileName = Date.now()+"_"+req.body.title+"_"+file.originalname;
        s3FileNames.push(fileName)
      cb(null, fileName );
    }
  })
})


var middleware 	= require("../middleware");




router.get("/",middleware.isBlogReadOnly, function(req,res){
        Blog.find({}, function(err, allBlogs){
          if(err){

            console.log(err);
          }else{
            res.render("blogs/index.ejs", { blogs: allBlogs});
          }
        });
});

router.post("/",[middleware.isBlogFullAccess, upload.any()], function(req, res){


    var newBlog = {
      blogTitle: req.body.title,
      blogState: req.body.state,
      blogAuthor:req.body.author,
      blogPublishedDate:req.body.publishedDate,
      blogMainImage:"https://s3.amazonaws.com/mtacmsblog/"+s3FileNames[0],
      blogAdditionalImage01:"https://s3.amazonaws.com/mtacmsblog/"+s3FileNames[1],
      blogAdditionalImage02:"https://s3.amazonaws.com/mtacmsblog/"+s3FileNames[2],
      blogAdditionalImage03:"https://s3.amazonaws.com/mtacmsblog/"+s3FileNames[3],
      blogContentBrief: req.body.contentBrief,
      blogContentExtended:req.body.contentExtended,
      blogTemplate:req.body.template
      }
    Blog.create(newBlog, function(err,newlyCreated){
      if(err){
        debugger;
        console.log(err);
      }else{
        var text
        res.redirect("/blogs")
      }
    })

});

router.get("/new", middleware.isBlogFullAccess, function(req,res){
    res.render("blogs/new.ejs")
});

router.get("/:id",middleware.isBlogReadOnly, function(req,res){
  Blog.findById(req.params.id, function(err, foundBlog ){
    if(err){
        console.log(err);
    }else{
        res.render("blogs/show.ejs" ,{blog : foundBlog})
    }
  })
});

router.get("/:id/edit", middleware.isBlogFullAccess, function(req, res){

  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      console.log(err);
    }else{
      res.render("blogs/edit.ejs", {blog: foundBlog});
    }
  })
});

router.put("/:id", middleware.isBlogFullAccess, function(req, res){
console.log("test etstestesteste");
console.log(req.body);

  var updatingBlog = {
    blogTitle: req.body.title,
    blogState: req.body.state,
    blogAuthor:req.body.author,
    blogPublishedDate:req.body.publishedDate,
    blogMainImage:req.body.mainImage,
    blogAdditionalImage01:req.body.additionalImage01,
    blogAdditionalImage02:req.body.additionalImage02,
    blogAdditionalImage03:req.body.additionalImage03,
    blogContentBrief: req.body.contentBrief,
    blogContentExtended:req.body.contentExtended,
    blogTemplate:req.body.template
  }

  Blog.findByIdAndUpdate(req.params.id, updatingBlog, function(err, updatedBlog){
      if(err){
        console.log(err);
      }else{
        res.redirect("/blogs/"+req.params.id);
      }
  });
});

router.delete("/:id", middleware.isBlogFullAccess, function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/blogs")
    }
  });
});

module.exports = router;
