var express = require('express');
var router = express.Router();
var sess;

/* GET admin panel view. */
router.get('/', function (req, res, next) {
    console.log("$$$$$$$$ router GET chat.js");
    sess = req.session;
    //Session set when user Request our app via URL
    if (sess.User) {
        res.render('chat', {
            user: req.user
        });
        var messages = [];
        var socket = io.connect('http://localhost:3700');
        var chatmsg = document.getElementById("chatmsg");
        var sendButton = document.getElementById("sendmsg");
        var content = document.getElementById("chatoutput");

        socket.on('message', function (data) {
            if (data.message) {
                messages.push(data);
                var html = '';
                for (var i = 0; i < messages.length; i++) {
                    html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                    html += messages[i].message + '<br />';
                }
                content.innerHTML = html;
                content.scrollTop = content.scrollHeight;
            } else {
                console.log("There is a problem:", data);
            }
        });
        sendButton.onclick = sendMessage = function () {
            if (chatmsg.value == "") {
                alert("Please type your name!");
            } else {
                var text = chatmsg.value;
                socket.emit('send', {
                    message: text,
                    username: name.value
                });
                chatmsg.value = "";
            }
        };
        $("#chatmsg").keyup(function (e) {
            if (e.keyCode == 13) {
                sendMessage();
            }
        });
    } else {
        res.render('login');
    }
});

module.exports = router;