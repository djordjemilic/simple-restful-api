const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const trim = require("lodash/trim");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const PORT = 3000;

// Database connection
mongoose.connect("mongodb://localhost:27017/wikiDB");

// Schemas and models
const ArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", ArticleSchema);

// Request targetiting all articles
app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, articles) => {
      if (!err) return res.send(articles);
      if (err) return res.send(err);
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err) => {
      if (!err) res.send("Succesfully aded a new article!");
      if (err) res.send(err);
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) res.send("Deleted all articles!");
      if (err) res.send(err);
    });
  });

// Request targetting a specific article

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: articleTitle }, (err, article) => {
      if (article) return res.send(article);
      if (!article)
        return res.send("No articles matching that title was found");
    });
  })
  .put((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: { title: req.body.title, content: req.body.content } },
      (err) => {
        if (!err) return res.send("Article updated successfully");
        if (err) return res.send(err);
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (!err) return res.send("Article updated successfully");
        if (err) return res.send(err);
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (!err) return res.send("Article successfully deleted");
      if (err) return res.send(err);
    });
  });

// Server listening
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
