// import libraries
const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// load configuration
let host = config.get('server.host');
let port = config.get('server.port');

// list to store user names
var userNames = [];
var allClient = [];

// function to get cookie
function getcookie(req) {
    var cookie = req.headers.cookie;
    if (cookie) {
        cookie = cookie.split('; ');
        var result = new Object();
        for (var i = 0; i < cookie.length; i++) {
            result[cookie[i].split('=')[0]] = cookie[i].split('=')[1];
        }
        return result;
    }
    return null;
}

// remove object form array
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

// use ejs as view engine
app.set("views", __dirname+'/public/');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// set static path
app.use(express.static('public'));

// some routes
app.get('/', function(req, res) {
    res.clearCookie("username");
    res.render('html/login.html', {
            errmsg: (req.query.err==undefined)?"":req.query.err
})});

app.post('/auth', function(req, res) {
    var name=req.body.username;
    if (!(userNames.includes(name))) {
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
    var cookie = getcookie(req)
    if (cookie){
        if (cookie.username == undefined) {
            res.redirect('/?err=Unknown%20error');
            return;
        }
        res.render("html/room.html");
        return;
    }
    res.redirect('/?err=Unknown%20error');
});

io.on("connection", function(socket) {
    socket.on("join", function(username){
        socket.username = username;
        userNames.push(username);
        console.log(username+" joined server");
    });
    socket.on("disconnect", function(){
        userNames.remove(socket.username);
        console.log(socket.username+" disconnected");
    });
    socket.on("msg", function(msg){
        io.emit("chatmsg", msg.username, msg.msg);
        console.log("{'username':"+msg.username+", 'msg':"+msg.msg+"}");
    });
});

// start http server
http.listen(port, ()=>{
    console.log("listening on http://"+host+":"+port);
})

