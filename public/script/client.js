var wsClient = {
    /**wsClinet
    *ws:ウェブソケットインスタンスの代入先
    *init:ws内での各種イベント時のコールバックで呼び出される函数の定義
    *sendMessage:引数のテキストをウェブソケットサーバに送信する
    *close:接続終了
    */
    ws: null,
    loginusername: null,
    init: function(url, handlers) {
        handlers = handlers || {};
        this.ws = new WebSocket(url);
        if ('message' in handlers) {
            this.ws.addEventListener('message',handlers['message'],true);
        }
        if('open' in handlers){
            this.ws.addEventListener('open',handlers['open'],true);
        }
        if('close' in handlers){
            this.ws.addEventListener('close',handlers['close'],true);
        }
    },
    sendMessage: function(msg) {
        this.ws.send(msg);
        changeView(msg);
    }
};

var sendBtnClick = function(){
    var inputText = document.getElementById('input_text').value;
    wsClient.sendMessage(inputText);
};

var loginBtnClick = function(){
    var inputText = document.getElementById('login_name').value;
    wsClient.sendMessage(inputText+' login');
};

var logoutBtnClick = function(){
    wsClient.sendMessage('Quit...');
};

var closeWs = function(){
    wsClient.sendMessage('anonymous Quit');
    wsClient.ws.close();
};

var changeView = function(msg){
    if(msg.type == 'message'){
        msg = msg.data;
    }
    var addElement = document.createElement('div');
    addElement.appendChild(document.createTextNode(msg));
    document.getElementById('chatlog').appendChild(addElement);
};

var joinAnonymous = function(event){
    event.target.send('Login Anonymous');
};
var fromleaveAnonymous = function(event){
    event.target.send('Logout Anonymous');
};

var entryPoint = function(){
    var host = 'ws://localhost:3000';
    var sendBtn = document.getElementById('send_button');
    sendBtn.addEventListener('click',sendBtnClick,true);
    var loginBtn = document.getElementById('login_button');
    loginBtn.addEventListener('click',loginBtnClick,true);
    var logoutBtn = document.getElementById('logout_button');
    logoutBtn.addEventListener('click',logoutBtnClick,true);
    wsClient.init(host, {
         open   : joinAnonymous
        ,message: changeView
        ,close  : closeWs
    });
};





document.getElementById("contents").addEventListener('load',entryPoint,true);
