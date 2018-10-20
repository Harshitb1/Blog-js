var express = require("express"),
    app= express(),
    methodOverride = require("method-override"),
    bodyParser= require("body-parser"),
   // expressSanitizer = require("express-sanitizer"),
    mongoose= require("mongoose");

mongoose.connect("mongodb://localhost/restful_blog_app");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
//app.use(expressSanitizer);

var blogSchema = new mongoose.Schema({
    title: String, 
    image: String,
    body: String,
    created : {type :Date , default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

app.listen(8000, function(){
    console.log("restful blog app running");
});

// Blog.create({
//     title : "test blog",
//     image : "https://photosforclass.com/download/flickr-14360459119",
//     body : " this is the body"
// });

app.get("/", function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs: blogs});
        }
    });
});

app.post("/blogs",function(req,res){
    // req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            console.log(err);
            res.render("new");
        }
        else{
            res.redirect("/blogs"); 
        }
    });
});
app.get("/blogs/new", function(req,res){
    res.render("new");
});
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundBlog});
        }
    });
});

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        } else {
             console.log("blog found with title"+foundBlog.title);
            res.render("edit",{blog : foundBlog});
        }
    });
});

app.put("/blogs/:id",function(req,res){
    // req.body.blog.body = req.sanitize(req.body.blog.body); 
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
          if(err){
              res.redirect("/blogs");
              console.log(err);
          }else{
              res.redirect("/blogs/"+req.params.id);
          }
      });
});

app.delete("/blogs/:id",function(req,res){
   Blog.findByIdAndRemove(req.params.id,function(err){
       if(err){
            console.log(err);
            res.redirect("/blogs");
       }else{
            console.log("blog delete with title"+req.params.id);
           
           res.redirect("/blogs");
       }
   });
});