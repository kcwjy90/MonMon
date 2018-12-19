
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

// var db = require('/.models')

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
// mongoose.connect("", {useNewUrlParser:true});




//Setting Up Routes

//GET route to scrape from usatoday.com

app.get("/scraped", function(req, res){
    //scraping the body using axios
    var result = {};
    var finalResult =[];

    axios.get("https://www.usatoday.com/").then(function(response){

        //loading into cheerio. Create Variable $ to store that
        var $ = cheerio.load(response.data);
        //Result variable to store the results
     

        //looping thru each of the <a> tag with hgpfm-link class
        $("a.hgpfm-link").each(function(i, element){
        

            //getting title, url, picture, and summary of each page
            result.title = $(this).find("p.js-asset-headline").text();
            result.link = 'usatoday.com' + $(this).attr("href")
            result.picture = $(this).find("img").attr("src")
            console.log(result, "hm")
            finalResult.push(result)
        })

        for (var i = 0; finalResult.length; i++){
            res.render("index", finalResult[i]);
        }
        
        
  
    });


 
})

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
  