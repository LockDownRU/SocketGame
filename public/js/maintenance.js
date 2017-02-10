/**
 * Created by Acer on 09.02.2017.
 */
function attack() {
    var elem = document.getElementById("myBar");
    var width = parseInt(elem.style.width);
    var end_width = width - 10;
    var id = setInterval(frame, 20);
    function frame() {
        if (width > end_width) {
            width--;
            elem.style.width = width + '%';
            document.getElementById("demo").innerHTML = width * 1  + '%';
        } else {
            clearInterval(id);
        }
    }
}

function resize() {
    /*var canvas = document.getElementById("gameCanvas");
    canvas.style.width = window.innerWidth;
    canvas.style.height = window.innerHeight;*/
    var online_container = document.getElementById("OC");
    var internal_online_container = document.getElementById("IOC");
    var list_item = document.getElementById("LI");
    online_container.style.height = (window.innerHeight - 58) * 0.443298969 - 8 + "px";
    internal_online_container.style.height = parseFloat(online_container.style.height) - 20 + "px";
    list_item.style.height = parseFloat(internal_online_container.style.height) - 45 - 4 + "px";

    var chat_container = document.getElementById("CC");
    var internal_chat_container = document.getElementById("ICC");
    var message_list_item = document.getElementById("MLI");
    chat_container.style.height = (window.innerHeight - 58) * 0.556701031 - 8 + "px";
    internal_chat_container.style.height = parseFloat(chat_container.style.height) - 20 + "px";
    message_list_item.style.height = parseFloat(internal_chat_container.style.height) - 38 - 4 + "px";
}

