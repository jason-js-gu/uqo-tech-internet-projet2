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
 app.use(bodyparser.json());

/**
 * Routes Definitions
 */

var messages={
    "public key1":"lfalkjeljfadk",
}


app.get("/", (req, res) => {
    res.render('index.html',{title: "Projet2"});
});

app.post("/addLetter", (req, res) => {
    var rst = req.body;    
    messages[Object.keys(rst)[0]]=rst[Object.keys(rst)[0]];
    res.send("Message sent");
});

app.get("/getLetters", (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.json(messages);    
});



/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});