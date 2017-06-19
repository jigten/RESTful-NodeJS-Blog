var express = require("express");
var router = express.Router();
var Blog = require("../models/blog");

// =====================
// BLOG ROUTES
// =====================

// INDEX - show all blogs
router.get("/", function (req, res) {
    Blog.find({}, function(err, blogs) {
        if(err) {
            console.log("Error");
        } else {
            res.render("blogs/index", {blogs: blogs});
        }
    });
});

// NEW - show form to create a new blog post
router.get("/new", function (req, res) {
    res.render("blogs/new");
});

// CREATE - add new blog post to the database
router.post("/", function (req, res) {
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
router.get("/:id", function (req ,res) {
    Blog.findById(req.params.id).populate("comments").exec(function (err, foundBlog) {
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("blogs/show", {blog: foundBlog});
        }
    });
});

// EDIT ROUTE
router.get("/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("blogs/edit", {blog: foundBlog});
        }
    });
});

// UPDATE ROUTE
router.put("/:id", function (req, res) {
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
router.delete("/:id", function (req, res) {
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

module.exports = router;
