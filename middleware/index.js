var Blog = require("../models/blog");
var Comment = require("../models/comment");

// all the middleware foes here
var middlewareObj = {};

middlewareObj.checkBlogOwnership = function(req, res, next) {
    // is user logged in
    if(req.isAuthenticated()) {
        Blog.findById(req.params.id, function(err, foundBlog) {
            if(err) {
                res.redirect("back");
            } else {
                // does the user own the blog post?
                if(foundBlog.author.id.equals(req.user._id) || req.user.idAdmin) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};


middlewareObj.checkCommentOwnership = function(req, res, next) {
    // is user logged in
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                res.redirect("back");
            } else {
                // does the user own the comment?
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = middlewareObj;