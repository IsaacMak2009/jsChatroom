// define some functions
function getcookie() {
    var cookie = document.cookie
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

function send(socket, usname) {
    socket.emit('msg', {
        username:usname,
        msg:$('#msg').val()
    });
    $('#msg').val('');
}

function addMessage(user, msg, isBot=false) {
    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
      
    msg = String(msg).replace(/[&<>"'`=\/]/g, function (s) {return entityMap[s];});
    if (isBot) {
        $('#chatroom').append($('<li>').html('<strong id="verified">'+user+"</strong>: "+msg));
    }else {
        $('#chatroom').append($('<li>').html('<strong>'+user+"</strong>: "+msg));
    }
}

// load messages
$.get('/../api/chats/data', function(result){
    if (result != null) {
        for (var i in result) {
            addMessage(result[i].username, result[i].msg, result[i].verified)
        }
    }
})

// main
var usname = getcookie().username;
var socket = io();
socket.emit('join', usname)
$('#send').on('click', function(){
    console.log('sended message');
    send(socket,usname);
})
$(document).keyup(function(event){
    if (event.which == 13 && $('#msg').val()) {
        console.log('sended message');
        send(socket,usname);
    }
})
socket.on('chatmsg', function(user, msg){
    addMessage(user, msg);
});
socket.on('botmsg', function(user, msg){
    addMessage(user, msg, isBot=true);
});