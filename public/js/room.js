// https://stackoverflow.com/a/40449074/18820662
if (document.cookie.indexOf('username=')==-1) {
    window.location.href = '../'; //one level up
}

var socket = io();