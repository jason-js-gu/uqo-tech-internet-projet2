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

//pairs
var pairs = {
    'pubKey(self)':'-----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqEi6bdiKHyeKLgTNdhrwC1AwM\r\n29Z4OLc4SlInrPT7ysQc/OXCqoCnbWiqJoUYBX5jr2fg9of5hncsIlO6xAONXmIQ\r\nfZkGiM53z2eVC8EidVCQ1E/8Uz9xwoCKjHAGY1RQUuGrX+Q7WjUkSHNqbsA/M9iM\r\n032KF7WipH+aZ4zt5QIDAQAB\r\n-----END PUBLIC KEY-----\r\n',
    'pubKey1(pair1)':'-----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIjsFXENKwI4cvQa02GpN0Dp/h\r\n1XrdEd4zPIjVLzo3iDn6iJ/0tje4mJNagFJGwDGIjywnH7LkcehlRuuc8vmD+NLs\r\nKPlwTMhNP9q3zo465kHdiIPdFZnXUL4wwe9BYS9WMb+Zr/ukQ/I4OdJNQS2jO3fl\r\nX8clv2gMVLGlOJqVkQIDAQAB\r\n-----END PUBLIC KEY-----\r\n',
    'pubKey2(pair2)':'-----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC02NrO6iCG0wD8/Q5uzZF+6vdx\r\nChtFZUr/jBG2PHlMAZ0BBFpu+uNQAuke+CAqyV/LdgBpQ+7A8cKXSuG8CBGvy6c7\r\nIEt65acXLtO5yszuQ7/3qToQUq92chsl9boIDBBr8/27NAqFb2Gp5IN/ZvgBZpkT\r\nvNrwPMUY7SNKMAno9QIDAQAB\r\n-----END PUBLIC KEY-----\r\n'
};

var messages={
    "public key1":"lfalkjeljfadk",
};

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

app.get("/peers",(req, res) => {
    res.setHeader('content-type', 'application/json');
    res.json(pairs); 
});

/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});