let express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send("Hello World!");
});

app.listen(5000);
console.log*("listening on http://localhost:5000");