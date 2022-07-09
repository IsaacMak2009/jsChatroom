// import libraries
const express = require('express');
const path = require('path');
var app = express();

// use ejs as view engine
app.set('view engine', 'ejs');
app.set("view", path.join(__dirname, 'public', 'html'));

// set static path
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.send("Hello World!");
});

app.listen(5000);
console.log("listening on http://localhost:5000");