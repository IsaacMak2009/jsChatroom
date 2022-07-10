// import libraries
const express = require('express');
const config = require('config');
var app = express();

// load configuration
var host = config.get('server.host');
var port = config.get('server.port');
var verify = config.get('app.verify');
var verifycode = verify ? config.get('app.verify-code'):null;


// use ejs as view engine
app.set("views", __dirname+'/public/');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// set static path
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('html/login.html', {
        isverify: verify,
        code: verifycode
    });
});

app.listen(port);
console.log("listening on http://"+host+":"+port);
