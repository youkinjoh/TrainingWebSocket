var wsClient = {
  /**wsClinet
  *ws:ウェブソケットインスタンスの代入先
  *init:ws内での各種イベント時のコールバックで呼び出される函数の定義
  *sendMessage:引数のテキストをウェブソケットサーバに送信する
  */
  ws: null,
  loginusername: 'Anonymous',
  init: function(url, handlers) {
    handlers = handlers || {};
    this.ws = new WebSocket(url);
    if ('message' in handlers) {
      this.ws.addEventListener('message', handlers['message'], false);
    }
    if ('open' in handlers) {
      this.ws.addEventListener('open', handlers['open'], false);
    }
    if ('close' in handlers) {
      this.ws.addEventListener('close', handlers['close'], false);
    }
  },
  sendMessage: function(msg) {
    var testObject = {
       data: msg.data
      ,type: msg.type
      ,speakername: this.loginusername
    };
    this.ws.send(JSON.stringify(testObject));
  }
};

var sendBtnClick = function() {
  var inputTextArea = document.getElementById('input_text');
  if (inputTextArea.value == '') {
    alert('Please input message!');
    return;
  }
  wsClient.sendMessage({
     data: inputTextArea.value
    ,type: 'message'
  });
  inputTextArea.value = '';
};

var loginBtnClick = function() {
  var inputText = document.getElementById('login_name').value;
  wsClient.loginusername = '[' + inputText + ']';
  wsClient.sendMessage({
     data: wsClient.loginusername + ' login'
    ,type: 'systemlog'
  });
};

var logoutBtnClick = function() {
  wsClient.loginusername = 'Anonymous';
  wsClient.sendMessage({
     data: 'Quit...'
    ,type: 'systemlog'
  });
};

var closeWs = function() {
  wsClient.sendMessage({
     data: 'anonymous Quit'
    ,type: 'systemlog'
  });
};

var changeView = function(msg) {
  msg = JSON.parse(msg.data);
  if (msg.type == 'message') {
    msg = msg.speakername + ':' + msg.data;
  }
  if (msg.type == 'systemlog') {
    msg = 'System:' + msg.data;
  }
  var addElement = document.createElement('div');
  addElement.appendChild(document.createTextNode(msg));
  var outputChatLog = document.getElementById('chatlog');
  outputChatLog.insertBefore(addElement, outputChatLog.firstChild);
};

var joinAnonymous = function(event) {
  var loginlog = {
     data: 'Login Anonymous'
    ,type: 'systemlog'
  };
  wsClient.sendMessage(loginlog);
};

var entryPoint = function() {
  var host = 'ws://' + window.location.host;
  var sendBtn = document.getElementById('send_button');
  sendBtn.addEventListener('click', sendBtnClick, false);
  var loginBtn = document.getElementById('login_button');
  loginBtn.addEventListener('click', loginBtnClick, false);
  var logoutBtn = document.getElementById('logout_button');
  logoutBtn.addEventListener('click', logoutBtnClick, false);
  wsClient.init(host, {
     open: joinAnonymous
    ,message: changeView
    ,close: closeWs
  });
};

window.addEventListener('load', entryPoint, false);
