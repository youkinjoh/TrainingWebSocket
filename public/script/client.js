var socket;

var socketClient = {
    init: function(){
        socket.onopen = function(){
            socket.send("login anonymous");
        };
        socket.onmessage = function(msg){
            changeView(msg.data);
        };
        socket.onclose = function(){
            socket.send("logout anonymous");
        };
    },
    sendMessage: function(msg){
        socket.send(msg);
        changeView(msg);
    },
    close: function(){
        socket.close();
    }
};

var sendBtnClick = function(){
    var inputText = document.getElementById('input_text').value;
    socketClient.sendMessage(inputText);
};

var entryPoint = function(){
    var host = "ws://localhost:3000";
    socket = new WebSocket(host);
    var sendBtn = document.getElementById("send_button");
    sendBtn.addEventListener("click",sendBtnClick);
    socketClient.init();
};



var changeView = function(msg){
    var addElement = document.createElement('div');
    addElement.innerHTML = msg;
    document.getElementById('chatlog').appendChild(addElement);
};

entryPoint();