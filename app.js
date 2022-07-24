const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const ejs = require("ejs")


const app = express()

app.set("view Engine", "ejs")

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/WikiDB")

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema)

app.route("/articles")
.get( function(req, res) {

  Article.find(function(err, foundArticles) {
    if (!err) {
      res.send(foundArticles)
    } else {
      res.send(err)
    }
})
})
.post(function(req,res){

  const title = req.body.title
  const content = req.body.content

  const newArticle = new Article({
    title: title,
    content: content
  })

  newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article.")
      } else {
        res.send(err);
      }
    });

})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Deleted Successfully")
    }
    else{
      res.send(err)
    }
  })
});

app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({title: req.params.articleTitle},
       function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found!");
      }
    })
  })
  .put(function(req,res){
    Article.updateOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},

      function(err){
        if(!err){
          res.send("Successfully updated article.")
        }
        else{
          res.send(err)
        }
      }
    )}
  )

  .patch(function(req, res){
    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successfully updated article.")
        }
        else{
          res.send(err)
        }
      }
    )
  })

  .delete(function(req, res){
    Article.deleteOne(
    { title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted ")
      }
      else{
        res.send(err)
      }
    }
    )
  })











app.listen(3000, function() {
  console.log("Server Started on port 3000.");
})
