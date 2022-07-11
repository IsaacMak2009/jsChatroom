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

function addMessage(usname, msg) {
    $('#chatroom').append($('<li>').html('<strong>'+user+"</strong>: "+msg));
}

var usname = getcookie().username;

if (usname==undefined) {
    window.location.href = '../'; //one level up
}

var socket = io();
socket.emit('join', usname)



$('#send').on('click', function(){
    console.log('send');
    send();
})

socket.on('chatmsg', function(user, msg){
    addMessage(user, msg);
});