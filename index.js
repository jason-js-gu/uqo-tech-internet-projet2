/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");
const bodyparser = require('body-parser');
/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */
 app.set('views',__dirname + '/views');
 app.engine('html', require('ejs').renderFile);
 app.set('view engine', 'html');
 app.use(express.static(__dirname + '/public'));
 
/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
    res.render('index.html',{title: "Projet2"});
});

app.get("/getLetters", (req, res) => {
    res.setHeader('content-type', 'application/json');
    
    res.render('index.html',{title: "Projet2"});
});


/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});