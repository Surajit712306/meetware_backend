function connect(server, app)
{
    const socketio = require('socket.io');
    const io = socketio(server, {
        cors: {
            origin: '*'
        }
    });

    io.on('connection', socket => {
        console.log(`Socket with ${socket.id} is connected.`);
        socket.on('join-room', roomId => {
            socket.join(roomId);
            const remoteUserIds = Array.from(io.sockets.adapter.rooms.get(roomId)).filter(remoteUserId => remoteUserId !== socket.id);

            if(remoteUserIds.length > 0)
            {
                socket.emit('remoteusers-connected', remoteUserIds);
            }

            socket.on('offer', payload => {
                io.to(payload.calleeId).emit('offer', {
                    sdp: payload.sdp,
                    callerId: socket.id
                });
            });

            socket.on('answer', payload => {
                io.to(payload.callerId).emit('answer', {
                    sdp: payload.sdp,
                    calleeId: socket.id
                });
            });

            socket.on('icecandidate', payload => {
                io.to(payload.receiver).emit('icecandidate', {
                    candidate: payload.candidate,
                    sender: socket.id
                });
            });

            socket.on('disconnect', () => {
                console.log(`Socket with ${socket.id} is disconnected.`);
                socket.to(roomId).emit('remoteuser-disconnected', socket.id);
            });

        });
    });
    console.log(`Socket server is running at http://localhost:${app.get('port')}.`);
}

module.exports = connect;