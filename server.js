
//requiring necessary npms
var express = require("express");
var app = express();

//requiring express handlebars
var exphbs = require("express-handlebars");

//setting handlebars as the default templating engine
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//for mongo
var mongoose = require("mongoose");

//Two packages required for scraping
var cheerio = require("cheerio");
var axios = require("axios");

var db = require('./models')

//setting up port
var PORT = 3000;

//morgan logger for logging request
var logger = require("morgan");
app.use(logger("dev"));

//To parse request body as json
app.use(express.urlencoded({extended:true}));
app.use(express.json())

//for static folder
app.use(express.static("public"))


//this will connect to the mongoDB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);



//Setting Up Routes

//GET route to scrape from usatoday.com

app.get("/scraped", function(req, res){
    //scraping the body using axios
    var result = {};
    var finalResult =[];

    axios.get("https://www.nytimes.com/section/world/asia").then(function(response){

        //loading into cheerio. Create Variable $ to store that
        var $ = cheerio.load(response.data);
        //Result variable to store the results
     

        //looping thru each of the <a> tag with hgpfm-link class
        $("li.css-ye6x8s").each(function(i, element){
        

            //getting title, url, picture, and summary of each page
            result.title = $(this).find("h2.css-1dq8tca").text();
            result.summary = $(this).find("p.css-1echdzn").text();
            result.link = "https://www.nytimes.com/section/world/asia" + $(this).find("a").attr("href")
            result.picture = $(this).find("img.css-11cwn6f").attr("src")
            // finalResult.push(result)
            // console.log("여끼여끼", finalResult)

            db.Article.create(result)
            .then(function(dbArticle){
                console.log("this", dbArticle)
                // console.log(result[0])
                // console.log("hi", typeof(dbArticle))
        // for (var i = 0; finalResult.length; i++){
        //     console.log(finalResult.length)
        //     res.render("index", finalResult[i]);
        // }
                // res.render("index", dbArticle)
                // console.log(dbArticle)
            })
            .catch(function(err){
                console.log(err)
            })
            // console.log(dbArticle)
          
        });
    
        res.send("SCRAPED!")
        
        
  
    });


 
})





// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
                  res.render("index", dbArticle)
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });





  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  

// var trying = {
//     title: "haha",
//     link: "lala",
//     picture: "buhaha"
// }

// app.get("/haha", function(req, res){
//     res.render("index", trying);
// })




// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  