const socketIO = require('socket.io');

const arrOrigins = [
    "http://localhost:3001",
    "https://siegfired-847bb.web.app",
    "https://siegfried.roomin.app",
    "http://localhost:3000"
];

var clients = {};

function createSockets(appServer) {

    const io = socketIO(appServer, {
        cors: {
            origin: arrOrigins,
            methods: ["GET", "POST"]
        }
    });


    io.on('connection', (socket) => {
        console.log('new connection', socket.id);

        socket.on("disconnect", () => {
            console.log('disconnection', socket.id); // undefined
            socket.broadcast.emit('drop-client', socket.id);
        });

        socket.on('persist-player', data => {
            clients[data.user.id] = data;
            socket.broadcast.emit('new-client', data)
        });

        //socket.on("client-position", (data) => {
        //    clients[socket.id] = data;
        //    // socket.broadcast.emit('clients', clients);
        //});
//
//
        //socket.broadcast.emit('new-client', ({ newId: socket.id, oldClients: clients }));
    });

    setInterval(() => {
        io.emit('clients', clients);
    }, 500);

}

module.exports = {
    createSockets,
}