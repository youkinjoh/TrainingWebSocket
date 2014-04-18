var wsClient = {
    /**wsClinet
    *ws:ウェブソケットインスタンスの代入先
    *init:ws内での各種イベント時のコールバックで呼び出される函数の定義
    *sendMessage:引数のテキストをウェブソケットサーバに送信する
    *close:接続終了
    */
    ws: null,
    init: function(socket){
        this.ws = socket;
        this.ws.onopen = function() {
            this.ws.send('login anonymous');
        };
        this.ws.onmessage = function(msg) {
            changeView(msg.data);
        };
        this.ws.onclose = function() {
            this.ws.send('logout anonymous');
        };
    },
    sendMessage: function(msg,callback){
        this.ws.send(msg);
        callback(msg);
    },
    close: function(socket){
        this.ws.close();
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
