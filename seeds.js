var mongoose = require("mongoose"),
    Blog = require("./models/blog"),
    Comment = require("./models/comment");

var data = [
    {
        title: "Rosa Diaz",
        image: "https://images-na.ssl-images-amazon.com/images/M/MV5BMjM2MTYzOTY4NF5BMl5BanBnXkFtZTgwOTkxNjEzMjE@._V1_.jpg",
        body: "Rosa Diaz from Brooklyn Nine Nine. Aliquam id felis luctus, ullamcorper nisl at, vestibulum urna. Cras blandit, enim sodales elementum porta, lacus metus iaculis massa, ut condimentum sapien ligula eu metus. Nam eget ultrices leo. Quisque scelerisque lobortis laoreet. Etiam non vestibulum nisl, ac interdum turpis. Suspendisse enim dolor, posuere eget auctor non, faucibus quis lacus. Maecenas vestibulum pharetra lacus in molestie. Vivamus sit amet elit finibus, ultricies libero ut, commodo lorem. In vehicula metus ante. Vivamus a luctus enim, quis dignissim velit. Cras rhoncus felis nec facilisis molestie. Quisque in tempus ipsum."
    },
    {
        title: "Hermione Granger",
        image: "https://pbs.twimg.com/profile_images/527201530102161408/M_Uv2Xjr_400x400.jpeg",
        body: "Hermione Granger from the Harry Potter series. Donec facilisis, leo a semper condimentum, nulla ex blandit erat, a rhoncus massa arcu sit amet arcu. Maecenas aliquet risus ut sem luctus finibus. Vivamus viverra varius augue vulputate sagittis. Etiam non nunc feugiat massa rhoncus commodo ut ac nunc. Duis accumsan, risus quis cursus auctor, neque turpis ullamcorper ante, eget ornare erat nisi et tellus. Mauris ac ex odio. Praesent bibendum lorem orci, non suscipit purus egestas vitae. Nulla viverra, mi quis pharetra congue, est elit feugiat nisi, et commodo nibh tellus sed arcu. Donec mattis suscipit quam vitae finibus."
    }
]

function seedDB() {
    // Remove existing blog posts
    Blog.remove({}, function(err) {
        if(err) {
            console.log(err);
        }
        console.log("Removed all blog posts");
        // after removing, add a few blog posts
        data.forEach(function(seed) {
            Blog.create(seed, function(err, blogPost) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Added a blog post");
                    // Create a comment
                    Comment.create(
                        {
                            text: "She just carries the series by herself",
                            author: "Jake"
                        }, function(err, comment) {
                            if(err) {
                                console.log(err);
                            } else {
                                blogPost.comments.push(comment);
                                blogPost.save();
                                console.log("Created a new comment");
                            }
                        });
                }
            });
        });
    });
}

module.exports = seedDB;