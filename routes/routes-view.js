const db = require("../models")

module.exports = function (app) {

    app.get("/", function (req, res) {
        var savedArticles = {}
        savedArticles["articles"] = []

        db.Article //not-saved articles 
        .find({$query: {saved: false} }) 
        //soring by descending dates 
        .sort( { date: -1 }) 
        
        //Loop thru to display each item
            .then(function (foundSorted) {
                if (foundSorted.length > 0) {
                    for (var i = 0; i < foundSorted.length; i++) {
                        // console.log(foundSorted[i]);
                        newObj = {

                            id: foundSorted[i]._id,
                            name: foundSorted[i].name,
                            summary: foundSorted[i].summary,
                            link: foundSorted[i].link,
                            picture: foundSorted[i].picture,
                            saved: foundSorted[i].saved,
                            notes: foundSorted[i].notes

                        }

                        savedArticles.articles.push(newObj);

                        //not exactly sure what this does..
                        if (i == (foundSorted.length - 1)) {
                            // res.json(savedArticles)
                            res.render("home", savedArticles)
                        }

                    }

                }

                else {
                    res.render("home")
                }

            });

    });

    app.get("/saved", function (req, res) {
        var savedArticles = {}
        savedArticles["articles"] = []
        db.Article 
        //finding all saved articles 
        .find({saved: true}) 
        //soring by descending dates 
        .sort({date: -1})

            .then(function (foundSorted) {
                if (foundSorted.length > 0) {
                    for (var k = 0; k < foundSorted.length; k++) {
                        console.log(foundSorted[k]);

                        newObj = {

                            id: foundSorted[k]._id,
                            name: foundSorted[k].name,
                            summary: foundSorted[k].summary,
                            link: foundSorted[k].link,
                            picture: foundSorted[k].picture,
                            saved: foundSorted[k].saved,
                            notes: foundSorted[k].notes

                        }

                        savedArticles.articles.push(newObj);

                        if (k == (foundSorted.length - 1)) {

                            // res.json(savedArticles)
                            // let newArticles = savedArticles.articles.reverse();
                            // savedArticles["articles"] = newArticles
                            res.render("saved", savedArticles)

                        }

                    }

                }

                else {

                    res.render("saved")

                }

            });

    });

}