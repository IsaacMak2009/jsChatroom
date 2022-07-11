// import libraries
const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

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

// function to get cookie
function getcookie(req) {
    var cookie = req.headers.cookie;
    cookie = cookie.split('; ');
    var result = new Object();
    for (var i = 0; i < cookie.length; i++) {
        result[cookie[i].split('=')[0]] = cookie[i].split('=')[1];
    }
    return result;
}

// use ejs as view engine
app.set("views", __dirname+'/public/');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// set static path
app.use(express.static('public'));

// some routes
app.get('/', function(req, res) {
    if (getcookie(req).username!=undefined) {
        res.redirect('/chatroom');
        return;
    }
    res.render('html/login.html', {
            errmsg: (req.query.err==undefined)?"":req.query.err
})});

app.post('/auth', function(req, res) {
    var name=req.body.username;
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
    // check cookie
    // console.log(getcookie(req))
    if (getcookie(req).username == undefined) {
        res.redirect('/?err=Unknown%20error');
        return;
    }
    res.render("html/room.html");
});

io.on("connection", function(socket) {
    console.log("user connected");
    socket.on("disconnect", function(){
        console.log("user disconnected");
    })
});

// start http server
http.listen(port, ()=>{
    console.log("listening on http://"+host+":"+port);
})

