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
let maxMsgStroage = config.get('app.maxMsgStroage');
let loadPreviousData = config.get('app.loadPreviousData');

// variables to store data
var userNames = ["Bot"];
var chats = [];
var stored = 0

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

function sendMsg(msg,io) {
    msg.verified = false
    if (stored==maxMsgStroage) {
        chats.shift();
        stored -= 1;
    }
    chats.push(msg)
    stored += 1;
    io.emit("chatmsg", msg.username, msg.msg);
    console.log(JSON.stringify(msg))
}

function sendBotMsg(msg,io) {
    if (stored==maxMsgStroage) {
        chats.shift();
        stored -= 1;
    }
    chats.push({"username": "Bot", "msg": msg, "verified": true});
    stored += 1
    io.emit("botmsg", "Bot", msg);
    console.log(JSON.stringify({"username": "Bot", "msg": msg, "verified": true}))
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
        if (/^[A-Za-z0-9]*$/.test(name)){
            res.cookie('username',name);
            res.redirect('/chatroom');
            return;
        } else {
            res.redirect('/?err=username%20is%20not%20exceptable');
        }
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

app.get('/api/chats/data', function(req, res) {
    if (loadPreviousData==true) {
        res.send(chats);
        return;
    }
    res.send(null);
});

io.on("connection", function(socket) {
    socket.on("join", function(username){
        socket.username = username;
        userNames.push(username);
        sendBotMsg(username+" joined server", io)
    });
    socket.on("disconnect", function(){
        userNames.remove(socket.username);
        sendBotMsg(socket.username+" disconnected", io)
    });
    socket.on("msg", function(msg){
        sendMsg(msg,io);
    });
});

// start http server
http.listen(port, ()=>{
    console.log("listening on http://"+host+":"+port);
})

