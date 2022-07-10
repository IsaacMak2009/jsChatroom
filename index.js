// import libraries
const express = require('express');
const path = require('path');
const config = require('config');

var app = express();
var host = config.get('server.host');
var port = config.get('server.port');

// use ejs as view engine
app.set('view engine', 'ejs');
app.set("view", path.join(__dirname, 'public', 'html'));

// set static path
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.send("Hello World!");
});

app.listen(port);
console.log("listening on http://"+host+":"+port);
