const express = require('express');
const app = express();

const http = require('http');

const server = http.createServer(app);

/**
 * Port Listen
 */
server.listen(3000);

app.use(express.static('public'))

/**
 * Socket.io
 */
const socketIo = require('socket.io');
const io = socketIo(server);

/**
 * init arrays
 */
UserOnId = [];
IdsOnUser = [];

io.on('connect', function(socket){
    console.log("------------------------------------------");
    console.log("New conection id: "+ socket.id);

    socket.on("user_data", function(data) {
        console.log("on user_data");
        console.log("Id User: "+ socket.id);
        console.log("Email: "+ data.email);
        console.log("Username: "+ data.user);

        data_user = data.user;
        id_user = socket.id;

        // Save user by id
        UserOnId[id_user] = data_user;

        // Save id by user
        if(IdsOnUser[data_user] == null) {
            IdsOnUser[data_user] = new Array();
        }

        IdsOnUser[data_user].push(id_user);

        console.log("data_user: ", data_user);
        console.log("id_user: ", id_user);
        console.log("UserOnId: ", UserOnId);
        console.log("IdsOnUser: ", IdsOnUser);

        io.emit("new_user", {user: data.user, id_user: id_user, type: "LogIn"});
    });

    /**
     * Send message
     * @param data
     */
    socket.on("send_message", function(data) {
        console.log("------------------------------------------");
        console.log("on send_message");
        console.log("data: ", data);
        
        if(data.toUser != null) {
            console.log("_recipient: ", data.toUser);
            console.log(data.user + " is sending a message to " + data.toUser);

            _recipient = data.toUser;
            _idOnlines = IdsOnUser[_recipient];
            console.log("_recipient: "+ _recipient);
            console.log("_idOnlines: "+ _idOnlines);

            for (var i = 0; i < _idOnlines.length; i++) { 
                console.log("for _idOnlines: "+ _idOnlines[i]);

                io.to(_idOnlines[i]).emit("new_message", {user: data.user, message: data.message, toUser: _recipient});
            }

            io.to(socket.id).emit("new_message", {user: data.user, message: data.message, toUser: _recipient});
        } else {
            console.log("_recipient: ", data.toUser);
            console.log(data.user + " is sending a message");

            io.emit("new_message", {user: data.user, message: data.message, toUser: null});
        }
    });

    /**
     * Desconect
     */
    socket.on("disconnect", function() {
        console.log("------------------------------------------");
        console.log("on disconnect");
        id_user =  socket.id;

        if(UserOnId[id_user]) {
            usuario = UserOnId[id_user];
    
            delete UserOnId[id_user];
    
            array_ids = IdsOnUser[usuario];
    
            for (var i = 0; i < array_ids.length; i++) {
                if(array_ids[i] == id_user) {
                    id_to_delete = i;
                }
            }
    
            IdsOnUser[usuario].splice(id_to_delete, 1);
    
            if(IdsOnUser[usuario].length < 1) {
                delete IdsOnUser[usuario];
            }
    
            console.log("User "+usuario+ " logging off");

            io.emit("logout_session", {user: usuario, id_user: id_user, type: "LogOut"});
        }
    });
});