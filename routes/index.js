var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Blog = require("../models/blog");

// Landing Page redirecting to Blog Index route for now
router.get("/", function (req, res) {
    res.redirect("/blogs");
});

// =====================
// AUTH ROUTES
// =====================

// show register form
router.get("/register", function(req, res) {
    res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    if(req.body.adminCode === '2ez4rtz') {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/blogs");
        })
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
}), function(req, res) {
});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/blogs");
});

// USER PROFILES
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
       if(err) {
           res.redirect("/");
       } else {
           Blog.find().where('author.id').equals(foundUser._id).exec(function(err, blogs) {
               if(err) {
                   res.redirect("/");
               } else{
                   res.render("users/show", {user: foundUser, blogs: blogs});
               }
           });
       }
    });
});

module.exports = router;