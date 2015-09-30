/// </// <reference path="./interfaces"/>
var express = require('express');
var osc = require('node-osc');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var oscServer = new osc.Server(12000, '0.0.0.0');
oscServer.on("message", function (msg, rinfo) {
    var name = msg[2][1];
    var value = msg[2][2];
    if (name != "/channel") {
        console.log("emitting", name, " ", value);
        io.emit("message", { name: name, value: value });
    }
});
app.use(express.static('public'));
io.on('connection', function (socket) {
    console.log("got connection!");
});
http.listen(3000, function () {
    console.log('listening on *:3000');
});
