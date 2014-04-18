var wsClient = {
    init: function(socket){
        alert('oass');
        this.socket = socket;
        socket.onopen = function() {
            this.socket.send('login anonymous');
        };
        socket.onmessage = function(msg) {
            this.changeView(msg.data);
        };
        socket.onclose = function() {
            this.socket.send('logout anonymous');
        };
    },
    sendMessage: function(msg,callback){
        this.socket.send(msg);
        callback(msg);
    },
    close: function(socket){
        socket.close();
    }
};

var sendBtnClick = function(){
    var inputText = document.getElementById('input_text').value;
    wsClient.sendMessage(inputText,changeView);
};

var entryPoint = function(){
    var host = 'ws://localhost:3000';
    var socket = new WebSocket(host);
    var sendBtn = document.getElementById('send_button');
    sendBtn.addEventListener('click',sendBtnClick,true);
    wsClient.init(socket);
};

var changeView = function(msg){
    var addElement = document.createElement('div');
    addElement.appendChild(document.createTextNode(msg));
    document.getElementById('chatlog').appendChild(addElement);
};

document.getElementById("contents").addEventListener('load',entryPoint,true);
