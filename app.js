var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    express = require("express"),
    Blog = require("./models/blog"),
    Comment = require("./models/comment"),
    app = express(),
    seedDB = require("./seeds");

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

seedDB();

// ROUTES

// =====================
// BLOG POST ROUTES
// =====================
app.get("/", function (req, res) {
   res.redirect("/blogs");
});

// INDEX - show all blogs
app.get("/blogs", function (req, res) {
    Blog.find({}, function(err, blogs) {
       if(err) {
           console.log("Error");
       } else {
           res.render("blogs/index", {blogs: blogs});
       }
    });
});

// NEW - show form to create a new blog post
app.get("/blogs/new", function (req, res) {
    res.render("blogs/new");
});

// CREATE - add new blog post to the database
app.post("/blogs", function (req, res) {
    // create new blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if(err) {
            res.render("blogs/new");
        } else {
            // redirect to the index
            res.redirect("/blogs");
        }
    });
});

// SHOW - shows more info about one blog post
app.get("/blogs/:id", function (req ,res) {
   Blog.findById(req.params.id).populate("comments").exec(function (err, foundBlog) {
      if(err){
          res.redirect("/blogs");
      } else {
          res.render("blogs/show", {blog: foundBlog});
      }
   });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("blogs/edit", {blog: foundBlog});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
       if(err) {
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs/" + req.params.id);
       }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id", function (req, res) {
    // destroy blog post
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/blogs");
        } else {
            // redirect somewhere
            res.redirect("/blogs");
        }
    });
});

// =====================
// COMMENTS ROUTES
// =====================

// NEW - show a form to create a new comment
app.get("/blogs/:id/comments/new", function(req ,res) {
    // find the blog post by id
    Blog.findById(req.params.id, function(err, blogPost) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {blog: blogPost});
        }
    })
});

// CREATE - add the comment to the post and save to the database
app.post("/blogs/:id/comments", function(req, res) {
    // look up the blog post using ID
    Blog.findById(req.params.id, function(err, blogPost) {
        if(err) {
            console.log(err);
        } else {
            // create the new comment
            Comment.create(req.body.comment, function(err, comment) {
                // associate the comment with the blog post
                blogPost.comments.push(comment);
                blogPost.save();
                res.redirect("/blogs/" + req.params.id);
            });
        }
    });
});

app.listen(3000, function() {
   console.log("Server is serving on port 3000...");
});