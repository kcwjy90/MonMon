const cheerio = require("cheerio");
const request = require("request");
const db = require("../models")

module.exports = function (app) {
    app.get("/api/scraped", function (req, res) {
        db.Article.find({ $query: { saved: false } }).sort({ date: -1 })
            .then(function (response) {
                // res.json(response.length)
                res.json(response)
            })

    });

    //finding all the notes that were saved by -id. Might not need this page.

    app.get("/api/notes", function (req, res) {
        db.Note.find({})
            .then(function (response) {
                res.json(response)
                // res.json(response)
            })

    });

    // post (MY POST METHOD GOES HERE)

    app.post("/api/scrape", function (req, res) {
        request("http://www.npr.org/sections/news/", function (error, response, html) {
            const $ = cheerio.load(html);
            console.log($("article.item").length)
            $("article.item").each(function (i, element) {
                let Article = $(element).find('.item-info').find('.title').find('a').text();
                let summary = $(element).find('.item-info').find('.teaser').find('a').text();
                let link = $(element).find('.item-info').find('.title').children().attr("href");
                let photo = $(element).find('.item-image').find('.imagewrap').find('a').find('img').attr("src");
                let date = $(element).find('.item-info').find('.teaser').find('a').find('time').attr("datetime");
                let NewArticle = {

                    name: name,
                    summary: summary,
                    link: link,
                    picture: picture,
                    date: date
                }

                db.Article.create(NewArticle, function (error) {
                    if (error) console.log("Article already exists: " + NewArticle.Article)
                    else {
                        console.log("New article: " + NewArticle.name);
                    }

                    if (i == ($("article.item").length - 1)) {
                        res.json("scrape complete")
                    }

                })

            });

        })

    });

    // Removing old ones

    app.delete("/api/old", function (req, res) {

        db.Article.find({ $query: { saved: false } }).sort({ date: -1 })

            .then(function (foundSorted) {

                console.log(foundSorted.length);

                let oldLength = foundSorted.length;

                let mustRemove = oldLength - 15;

                console.log(mustRemove)

                let mustRemoveArray = [];

                for (var i = 0; i < (mustRemove); i++) {

                    mustRemoveArray.push(foundSorted[15 + i]._id);

                    console.log(mustRemoveArray)

                }

                db.Article.remove({ _id: { $in: mustRemoveArray } }, function (error, result) {

                    result["length"] = oldLength;

                    console.log(result)

                    res.json(result)

                })

            });

    })

    app.put("/api/save/article/:id", function (req, res) {

        let articleId = req.params.id;

        db.Article.findOneAndUpdate(

            { _id: articleId },

            {

                $set: { saved: true }

            }

        ).then(function (result) {

            res.json(result)

        })

    });

    app.put("/api/delete/article/:id", function (req, res) {

        let articleId = req.params.id;

        db.Article.findOneAndUpdate(

            { _id: articleId },

            {

                $set: { saved: false }

            }

        ).then(function (result) {

            res.json(result)

        })

    });

    app.get("/api/notes/:id", function (req, res) {

        let articleId = req.params.id;

        db.Article.findOne(

            { _id: articleId }

        )

            .populate("note")

            .then(function (result) {

                res.json(result)

            })

    });

    app.post("/api/create/notes/:id", function (req, res) {

        console.log(req.body);

        db.Note.create(req.body)

            .then(function (dbNote) {

                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });

            })

            .then(function (result) {

                res.json(result);

            })

            .catch(function (err) {

                res.json(err);

            });

    });

    // delete Article documents manually if needed

    app.get("/api/clear", function (req, res) {

        db.Article.remove()

            .then(function () {

                res.json("documents removed from Article collection")

            })

    });

    // delete Note

    app.delete("/api/delete/notes/:id", function (req, res) {

        db.Note.remove(

            { _id: req.params.id }

        )

            .then(function (result) {

                res.json(result)

            })

    });

}