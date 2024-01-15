const app = require('./app')
const http = require('http').Server(app);

const FRONT_URL = process.env.FRONT_URL || "localhost"
const FRONT_PORT = process.env.FRONT_PORT || 3000
const SOCKET_URL_LISTEN = "http://" + FRONT_URL + ":" + FRONT_PORT //"http://localhost:3000"

const socketIO = require('socket.io')(http, {
    cors: {
        origin: SOCKET_URL_LISTEN
    }
});

const getWordHit = (Word) => {
    let hit
    switch (Word) {
        case "con":
            hit = 10
            break;
        case "salope":
            hit = 30
            break;
        case "pute":
            hit = 40
            break;
        default:
            hit = 0
            break;
    }

    return hit;
}

let users = [];

socketIO.on('connection', (socket) => {
    console.log(`✅: ${socket.id} user just connected! `);

    //Listens and sends the return message to all the users on the server
    socket.on('message', async (data) => {
        // update messages to All clients
        socketIO.emit('messageResponse', data);

        console.log("users before message hit:", users)

        // update score to All clients
        const hitWord = await getWordHit(data.text)
        const socketIdSender = data.socketID
        users.forEach(user => {
            if (user.socketID !== socketIdSender) {
                user.score = user.score - hitWord
                if (user.score < 0) {
                    user.score = 0
                }
            }
        });
        socketIO.emit('updateUsersScores', users);

        console.log("message :", data)
        console.log("users after message hit :", users)
    });

    //Listens when a user is typing
    socket.on('typing', (data) => {
        //console.log("typing :", data)
        socket.broadcast.emit('typingResponse', data)
    });


    //Listens when a new user joins the server
    socket.on('newUser', (data) => {
        //Adds the new user to the list of users
        users.push(
            {
                ...data,
                score: 100
            }
        );
        console.log(users);
        //Sends the list of users to the client
        socketIO.emit('newUserResponse', users);
    });

    socket.on('disconnect', () => {
        console.log('❌: A user disconnected');
        //Updates the list of users when a user disconnects from the server
        users = users.filter((user) => user.socketID !== socket.id);
        // console.log(users);
        //Sends the list of users to the client
        socketIO.emit('newUserResponse', users);
        socket.disconnect();
    });
});

module.exports = http