$(document).ready(function () {

    // Chat

    $('message').keydown(function(event) {
        if (event.keyCode == 13){
            $('form').submit();
        }
    });

    $('form').submit(function () {
        var msgInput = $('#message');
        Socket.socket.emit('chat message', msgInput.val());
        msgInput.val('');
        return false;
    });
});

function sendMessage(){
    $('form').submit();
}