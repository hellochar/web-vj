/// </// <reference path="./interfaces"/>

var express = require('express');
var osc = require('node-osc');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

interface OscMessage {
    0: string;
    1: number;
    2: {
        0: string;
        1: string; // name
        2: number; // value
    };
}

var oscServer = new osc.Server(12000, '0.0.0.0');
oscServer.on("message", function (msg: OscMessage, rinfo) {
    const name = msg[2][1];
    const value = msg[2][2];

    if (name != "/channel") {
        console.log("emitting", name, " ", value);
        io.emit("message", {name: name, value: value});
    }
});


app.use(express.static('public'));

io.on('connection', (socket: SocketIO.Socket) => {
    console.log("got connection!");

})

http.listen(3000, function(){
  console.log('listening on *:3000');
});
