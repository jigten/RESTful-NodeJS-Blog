var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    express = require("express"),
    Blog = require("./models/blog"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    app = express(),
    seedDB = require("./seeds");

// requiring routes
var blogRoutes = require("./routes/blogs"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");


// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

seedDB();

// Passport Configuration
app.use(require("express-session")({
    secret: "I bet my life for you",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);

app.listen(3000, function() {
   console.log("Server is serving on port 3000...");
});