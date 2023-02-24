var socket_io = require('socket.io');
const io = socket_io({
    cors: {
        origin: true,
        credentials: true

    }
});
// allowEIO3: true,
//     cors: {
//     origin: true,
//         credentials: true
// },
// cors: {
//     origin: 'http://localhost:4600',
//         credentials: true
//
// }
var socketApi = {};

socketApi.io = io;



socketApi.sendNotification = function() {
    io.sockets.emit('hello', {msg: 'Hello World!'});
}

module.exports = socketApi;