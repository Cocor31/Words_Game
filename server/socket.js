const app = require('./app')
const http = require('http').Server(app);

const FRONT_URL = process.env.FRONT_URL || "localhost"
const FRONT_PORT = process.env.FRONT_PORT || 3000
const SOCKET_URL_LISTEN = "http://" + FRONT_URL + ":" + FRONT_PORT //"http://localhost:3000"

const GameService = require("./services/GameService")

const socketIO = require('socket.io')(http, {
    cors: {
        origin: SOCKET_URL_LISTEN
    }
});


let users = [];

socketIO.on('connection', (socket) => {
    console.log(`✅: ${socket.id} user just connected! `);

    //Listens and sends the return message to all the users on the server
    socket.on('message', async (data) => {
        console.log("message :", data)

        // update messages to All clients
        socketIO.emit('messageResponse', data);

        console.log("users before message hit:", users)
        // Get Word hit value
        const hitWord = await GameService.getWordHit(data.text)

        // update score to All clients
        const socketIdSender = data.socketID
        users = await GameService.hitOpponentsUsers(users, socketIdSender, hitWord)
        console.log("users after message hit :", users)

        socketIO.emit('updateUsersScores', users);

    });

    //Listens when a user is typing
    socket.on('typing', (data) => {
        //console.log("typing :", data)
        socket.broadcast.emit('typingResponse', data)
    });


    //Listens when a new user joins the server
    socket.on('newUser', async (data) => {
        //Adds the new user to the list of users
        users = await GameService.addUserToGroup(users, data)

        //Sends the list of users to the client
        socketIO.emit('newUserResponse', users);
    });

    socket.on('disconnect', async (data) => {
        console.log('❌: A user disconnected');
        //Updates the list of users when a user disconnects from the server
        const socketIdUser = socket.id
        users = await GameService.deleteUserFromGroup(users, socketIdUser)

        //Sends the list of users to the client
        socketIO.emit('newUserResponse', users);
        socket.disconnect();
    });
});

module.exports = http