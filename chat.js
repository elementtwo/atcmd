process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //warning: ignores self-signed SSL certs; use only for the beta

//var signalR = require('signalr-client');
var signalR = require('signalR.js');

var client  = new signalR.client(
    //signalR service URL
    "wss://at0.cloudapp.net:8080/signalr",

    // array of hubs to be supported in the connection
    //['chathub']
    //['chathub','messagehub','tradehub']
    ['chathub','messagehub','tradehub','authhub','historyhub']
);

var colors = null;
try {
  colors = require('colors/safe');
} catch (e) {
}

var readline = require('readline');
rl = readline.createInterface(process.stdin, process.stdout);
//rl.setPrompt('> ');
var state;
var globalauthtoken="";
var globalusername="";
var globalolddate="";
var globalchannel='en';

function setState(newstate) {
  if (newstate=='username') {
    state='username';
    rl.setPrompt('Enter username: ');
    rl.prompt(true);
  } else if (newstate=='password') {
    state='password';
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    rl.setPrompt('Enter password: ');
  } else if (newstate=='login') {
    state='login';
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    rl.setPrompt('(logging in)');
  } else if (newstate=='chat') {
    state='chat';
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    rl.setPrompt('> ');
  }
}

setState('username');

function DoAuthR(authtoken) {
  if (authtoken<0) {
    output("DoAuthR failed "+authtoken);
    setState('username');
  } else {
    output("DoAuthR success "+authtoken);
    globalauthtoken=authtoken;
    setState('chat');
    rl.prompt(true);
  }
}

function DoAuth(username, password) {
  rpc(['authHub', 'DoAuth', username, password], DoAuthR);
}

function SendMessageR(result) {
  if (result==1) {
  } else if (result==-99) { //bad auth token
    output("Logged out (-99)");
    setState('username');
  } else if (result==-97) { //invalid text
    output("Invalid text");
  } else if (result==-90) { //flood
    output("Slow down");
  } else if (result==-1) { //invalid username
    output("Logged out (-1)");
    setState('username');
  } else {
    output("SendMessage: Unknown error "+result);
    setState('username');
  }
}

function SendMessage(message, channel) {
  if (globalauthtoken==="") {
    output("not logged in");
    setState('username');
  } else {
    rpc(['chatHub', 'SendMessage', globalusername, globalauthtoken, message, channel], SendMessageR);
  }
}

function handle_line(line) {
  if (state == 'username') {
    globalusername=line.trim();
    setState('password');
  } else if (state == 'password') {
    this.password=line.trim();
    DoAuth(globalusername, this.password);
    setState('login');
  } else if (state == 'login') {
  } else if (state == 'chat') {
    SendMessage(line, globalchannel);
    setState('chat');
  } else {
  }
  rl.prompt(true);
}

rl.on('line', handle_line).on('close', function () { process.exit(0); });

function output(message) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log(message);
  //rl.write(message);
  //rl.write("\n");
  rl.prompt(true);
}

function print_chat_line(name, color, message, message_time) {
  var name_with_color="";
  var message_date=message_time.substr(0, 10);
  var message_minute=message_time.substr(11, 8);

  if (globalolddate!==message_date) {
    output(message_date);
    globalolddate=message_date;
  }

//  for (var i=message_time.length; i<=22; i++) {
//    message_time=message_time+"0";
//  }

  color=color.trim();
  if (colors == null) {
    name_with_color=name;
  } else if (color==='black') {
    name_with_color=name;
  } else if (color==='blue') {
    name_with_color=colors.blue(name);
//  } else if (color==='purple') {
//    name_with_color=colors.magenta(name);
//  } else if (color==='pink') {
//    name_with_color=colors.rainbow(name);
  } else if (color==='green') {
    name_with_color=colors.green(name);
  } else if (color==='red') {
    name_with_color=colors.red(name);
  } else if (color==='orange') {
    name_with_color=colors.yellow(name);
  } else {
    name_with_color=colors.cyan(name);
  }
  output(message_minute+" "+name_with_color + ": " + message);

  return true;
}

client.on(
  'ChatHub',
  'chatRX',
  print_chat_line
);

var callbacks=[]; //TODO: Use OOP

client.serviceHandlers.bound = function() { output("Websocket bound"); }
client.serviceHandlers.connectFailed = function(error) { output("Websocket connectFailed: ", error); }
client.serviceHandlers.connected = function(connection) { output("Websocket connected"); };
client.serviceHandlers.disconnected = function() { output("Websocket disconnected"); }
client.serviceHandlers.onerror = function(error) { output("Websocket onerror: ", error); }
client.serviceHandlers.messageReceived = function (message) {
  if (message.type === 'utf8' && message.utf8Data != "{}") {
    var parsed = JSON.parse(message.utf8Data);
    var callback;

    if ((parsed.R)&&(parsed.I)) {
      callback=callbacks[parsed.I];
      if (callback) { callback(parsed.R); }
      callbacks[parsed.I]=null;
      return true;
//    } else if (parsed.G) {
//    } else if (parsed.S) {
//    } else {
//      output("Websocket messageReceived: ", message);
    }
  }
  return false;
}
client.serviceHandlers.bindingError = function (error) { output("Websocket bindingError: ", error); }

client.serviceHandlers.connectionLost = function(error) {
     output("Connection Lost: ", error);
}

function rpc(args, callback) {
  var messageID=JSON.parse(client.invoke.apply(null, args)).I;
  callbacks[messageID]=callback;
  //output(messageID);
}

var getmore=0; //TODO: Use OOP
var getmorechannel=''; //TODO: Use OOP

function GetMessagesR(messages) {
  for (var i=0; i<messages.length; i++) {
    var channel=messages[i].Channel;
    var color=messages[i].Color;
    var timestamp=messages[i].Created;
    var id=messages[i].Id;
    var msg=messages[i].Message;
    var name=messages[i].Username;

    print_chat_line(name, color, msg, timestamp);
  }

  if (getmore>0) {
    GetMessages(getmorechannel, 0, getmore);
  }
}

function GetMessages(channel, start, count) {
  var max=100;

  if (count>max) {
    getmore=count-max;
    getmorechannel=channel;
    rpc(['chatHub','GetMessages',channel,getmore,max], GetMessagesR);
  } else {
    getmore=0;
    rpc(['chatHub','GetMessages',channel,0,count], GetMessagesR);
  }
}

client.serviceHandlers.reconnected = function(connection) {
    output("Websocket reconnected");
    var backlog=10;
    if (process.argv[2]>0) {
      backlog=process.argv[2];
    }

    rpc(['chatHub','Subscribe',globalchannel]); //there's a race condition if more messages arrive before GetMessages finishes
    GetMessages(globalchannel, 0, backlog);
};

client.serviceHandlers.reconnecting = function(retry /* { inital: true/false, count: 0} */) {
    output("Websocket Retrying: ", retry);
    return retry.count >= 3; /* cancel retry true */
}
