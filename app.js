const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB");

const ArticleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("article", ArticleSchema);

//-----X-------X-----X--------X-------X-------X-------X-------//

/////////////////////////// Requests for all articles//////////////////////

app.route("/articles")

.get(function(req, res){
    Article.find({}, function(err, articles){
        if(!err){
            res.send(articles);
        }
        else{
            res.send(err);
        }
    });
})

.post(function(req, res){
    const article = new Article({
        title: req.body.title,
        content: req.body.content
    });

    article.save(function(err){
        if(!err){
            res.send("Article inserted successfully!");
        }
        else{
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany({},function(err){
        if(!err){
            res.send("Deleted all articles.")
        }
        else{
            res.send(err);
        }
    });
});

///////////////////////// Requests for a specific article//////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){
    const requestedTitle = _.lowerCase(req.params.articleTitle);
    Article.findOne({title: {$regex: requestedTitle, $options: "i"}}, function(err, foundArticle){
        if(!err){
            if(foundArticle != null){
                res.send(foundArticle);
            }
            else{
                res.send("Sorry, No such article found!")
            }
        }
        else{
            res.send(err);
        }
    });
})

.put(function(req, res){
    const requestedTitle = _.lowerCase(req.params.articleTitle);
    Article.findOneAndUpdate(
        {title: {$regex: requestedTitle, $options: "i"}},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully replaced the doc")
            }
            else{
                res.send(err);
            }    
        }
    );
})

.patch(function(req, res){
    const requestedTitle = _.lowerCase(req.params.articleTitle);
    Article.findOneAndUpdate(
        {title: {$regex: requestedTitle, $options: "i"}},
        req.body,
        function(err){
            if(!err){
                res.send("Update the article successfully!");
            }
            else{
                res.send(err);
            }
        }
    );
})

.delete(function(req, res){
    const requestedTitle = _.lowerCase(req.params.articleTitle);
    Article.deleteOne( 
        {title: {$regex: requestedTitle, $options: "i"}},
        function(err){
            if(!err){
                res.send("Deleted the article successfully!")
            }
            else{
                res.send(err);
            }
        }  
    );
});

//-----X-------X-----X--------X-------X-------X-------X-------//

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});