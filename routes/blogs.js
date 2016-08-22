
var express = require('express');
var router = express.Router();
var Blog = require("../models/blog.js")

var middleware 	= require("../middleware");


router.get("/",middleware.isBlogReadOnly, function(req,res){
        Blog.find({}, function(err, allBlogs){
          if(err){
            debugger;
            console.log(err);
          }else{
            res.render("blogs/index.ejs", { blogs: allBlogs});
          }
        });
});

router.post("/",middleware.isBlogFullAccess, function(req, res){

    //get data from form
    var title = req.body.title;
    var image = req.body.image;
    var text = req.body.text;
    var author = req.body.author;
    //add to db
    var newBlog = {blogTitle: title, blogImage:image,blogText: text, blogAuthor:author}
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
  var title = req.body.title;
  var image = req.body.image;
  var text = req.body.text;
  var author = req.body.author;
  console.log(image);
  //add to db
  var updatingBlog = {blogTitle: title, blogImage:image, blogText: text, blogAuthor:author}

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
