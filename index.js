/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const bodyparser = require('body-parser');
const fs = require("fs");
//get request from the server to another server
var get=require("http-get-json");
//const { get } = require("express/lib/response");

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8000";

//peers
var peers = {
    'http://localhost:3000':'http://localhost:3000',
    'http://localhost:4000':'http://localhost:4000',
    'http://localhost:5000':'http://localhost:5000',
}

//messages, save messages temporarily
var messages={};

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

//responde to the get request from the client
app.get("/", (req, res) => {
    res.render('courriel.html',{});
});

//responde to the post request from the client
app.post("/addLetter", (req, res) => {
    var msg = req.body.msg; 
    messages[msg]=msg;
    fs.writeFile("messages.json",JSON.stringify(messages),(err)=>console.error(err));
    res.json("Message sent");
});


app.get("/getLetters", (req, res) => {
    //res.setHeader('content-type', 'application/json');
    var msgs={};
    msgs=fs.readFileSync("messages.json");
    if(msgs!={}){
        msgs=JSON.parse(msgs);
    }
    res.json(Object.values(msgs));    
});


/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});


/**
 * Communication between servers
 */
//synchronize the list of servers
setInterval(()=>get(`${Object.values(peers)[0]}/peers`,(err,newPeers)=>{
    if(err) return console.error(err);
    newPeers.forEach(newPeer=>peers[newPeer]=newPeer);
}),30000);


//synchronize the list of messages
setInterval(()=>get(`${Object.values(peers)[0]}/getLetters`,(err,newMsgs)=>{
    if(err) return console.error(err);
    //newMsgs.forEach(newMsg=>messages[newMsg]=newMsg);
    newMsgs.forEach(newMsg=>{
        messages[newMsg]=newMsg;
        fs.writeFile("message.json",JSON.stringify(messages),(err)=>console.error(err));
    });
}),30000);