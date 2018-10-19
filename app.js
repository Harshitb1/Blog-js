var express = require("express"),
    app= express(),
    bodyParser= require("body-parser"),
    mongoose= require("mongoose");

mongoose.connect("mongodb://localhost/restful_blog_app");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

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