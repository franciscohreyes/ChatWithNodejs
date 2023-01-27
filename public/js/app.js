const socket = io.connect();

/**
 * new_user
 * @param data
 */
socket.on("new_user", function(data) {
    console.log("New user connected: "+ data.user);
    console.log("Type: "+ data.type);

    switch (data.type) {
        case "LogIn":
            $("#cont_messages").append('<p><strong>'+data.user+': </strong> is logged in</p>');
            break;
    
        default:
            break;
    }
});

/**
 * logout_session
 * @param data
 */
socket.on("logout_session", function(data) {
    console.log("Logout session: "+ data.user);
    console.log("Type: "+ data.type);

    switch (data.type) {
        case "LogOut":
            $("#cont_messages").append('<p><strong>'+data.user+': </strong> logging off</p>');
            break;
    
        default:
            break;
    }
});

/**
 * new_message
 * @param data
 */
socket.on("new_message", function(data) {
    console.log("on new_message");

    $("#cont_messages").append('<p><strong>'+data.user+': </strong> '+data.message+'</p>');
    clearForm();
});

/**
 * signIn
 */
function signIn() {
    console.log("signIn");

    var _email = $("#email").val();
    var _username = $("#username").val();

    socket.emit("user_data", {email: _email, user: _username});
}

/**
 * Send messages
 */
function sendMessages() {
    console.log("sendMessages");

    var _user = $("#username").val();
    var _message = $("#message").val();
    var _toUser = $("#toUser").val();

    if(_toUser != "") {
        socket.emit("send_message", {user: _user, message: _message, toUser: _toUser});
    } else {
        socket.emit("send_message", {user: _user, message: _message, toUser: null});
    }
}

/**
 * clearForm
 * [Clean the textarea into the form]
 */
function clearForm() {
    $("#message").val("");
}