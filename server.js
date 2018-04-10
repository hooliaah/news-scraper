// require npm packages
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require('request');
var cheerio = require("cheerio");

// require models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// initialize Express
var app = express();

// log requests
app.use(logger("dev"));
// handle form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// serve the public folder as a static directory
app.use(express.static("public"));

// use either database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// connect to MongoDB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// scape on first view of homepage
app.get("/", function (req, res) {
  res.redirect("/scrape");
})

// scrape the NPR news section
app.get("/scrape", function (req, res) {
  request('https://www.npr.org/sections/news/', function (error, response, body) {
    var $ = cheerio.load(body);
    $("article h2").each(function (index, element) {
      var result = {};

      // add properties to results object with every article title and link
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      // need to add summary for each article

      // check if article is already in the database
      db.Article.count({ title: result.title }, function (error, count) {
        if (count == 0) {
          // add article to articles collection
          db.Article.create(result)
            .then(function (dbArticle) {
              console.log(dbArticle);
            })
            .catch(function (error) {
              return res.json(error);
            });
        } else {
          console.log("That article already exists in the database");
        }
      })
    })
  });

  res.send("Scrape Complete");
});

// get all Articles from the db
app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// get a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
    // populate with notes
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// route for posting a note to an article
app.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// route for deleting an Article's associated Note
app.delete("/articles/:id", function (req, res) {
  // remove a note
  db.Note.remove(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// start express server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});