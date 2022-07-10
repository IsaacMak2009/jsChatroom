// import libraries
const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
var app = express();

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// load configuration
var host = config.get('server.host');
var port = config.get('server.port');

// list to store user names
var userNames = [];

// use ejs as view engine
app.set("views", __dirname+'/public/');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// set static path
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('html/login.html', {
            errmsg: (req.query.err==undefined)?"":req.query.err
})});

app.post('/auth', function(req, res) {
    var name =req.body.username;
    if (!(userNames.includes(name))) {
        userNames.push(name);
        res.cookie('username',name);
        res.redirect('/chatroom');
        return;
    } else {
        res.redirect('/?err=username%20already%20used');
    }
});

app.get('/chatroom', function(req, res){
    res.render("html/room.html");
});

app.listen(port);
console.log("listening on http://"+host+":"+port);
