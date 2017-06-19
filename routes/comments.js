var express = require("express");
var router = express.Router({mergeParams: true});
var Blog = require("../models/blog"),
    Comment = require("../models/comment");

// =====================
// COMMENTS ROUTES
// =====================

// NEW - show a form to create a new comment
router.get("/new", isLoggedIn, function(req ,res) {
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
router.post("/", isLoggedIn, function(req, res) {
    // look up the blog post using ID
    Blog.findById(req.params.id, function(err, blogPost) {
        if(err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            // create the new comment
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    // add username and id to comment, we can also be sure a user exists
                    // because of the isLoggedIn middleware
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save the comment
                    comment.save();
                    // associate the comment with the blog post
                    blogPost.comments.push(comment);
                    blogPost.save();
                    res.redirect("/blogs/" + req.params.id);
                }
            });
        }
    });
});

// middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;