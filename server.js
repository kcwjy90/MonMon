
//requiring necessary npms
var express = require("express");
var app = express();
var bodyParser = require("body-parser")

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

//connecting to the models
var db = require('./models')


//setting up port
var PORT = process.env.PORT || 3000;

//morgan logger for logging request
var logger = require("morgan");
app.use(logger("dev"));

// Serve up static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

//parsing request in json format
app.use(express.urlencoded({extended:true}));
app.use(express.json())

//public folder
app.use(express.static("public"))

//connects to mongodb
mongoose.connect( process.env.MONGODB_URI ||"mongodb://localhost/mongoHeadlines", {useNewUrlParser: true});



//Setting Up Routes



//GET route to scrape from nytimes.com

app.get("/scrape", function(req, res){
  //scraping the body using axios

  axios.get("https://www.nytimes.com/section/business").then(function(response){
     
      //loading into cheerio. Create Variable $ to store that
      var $ = cheerio.load(response.data);
      //Result variable to store the results
   

      //looping thru each of the <a> tag with hgpfm-link class
      $("div.css-1cp3ece").each(function(i, element){
      
        var result = [];
          //getting title, url, picture, and summary of each page
          var title = $(element).find("h2.css-1dq8tca").text()

          var summary = $(element).find("p.e1xfvim31").text()
      
          var link = "https://www.nytimes.com/section/business"+ $(element).find("a").attr("href")
          var picture = $(element).find("figure").attr("itemid")
      
      
          result.push({
            title: title,
            sumamry: summary,
            link: link,
            picture: picture,
       
          })
          // finalResult.push(result)
          // console.log("여끼여끼", finalResult)

          db.Article.create(result)
          .then(function(dbArticle){
              console.log("this", dbArticle)
       
          })
          .catch(function(err){
              console.log(err)
          })
          // console.log(dbArticle)
        
      });
  
      res.send("SCRAPED!")
      
      

  });



})



// Route to retrieve articles from the database
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
              

        res.json(dbArticle);
      })
      .catch(function(err) {

        res.json(err);
      });
  });





  
  // Route for grab specific article with its notes
  app.get("/articles/:id", function(req, res) {
    

    //grabbing article with the given id in the parameter
    db.Article.findOne({ _id: req.params.id })
    
    //.populate bring all the notes that's saved with that specific id
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {

        res.json(err);
      });
  });
  



  // Route to  update notes with specific id
  app.post("/articles/:id", function(req, res) {
    
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
      
        //upon creating a note, it pulls the article with the same id.
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {

        res.json(dbArticle);
      })
      .catch(function(err) {

        res.json(err);
      });
  });
  


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  