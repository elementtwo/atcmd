process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //warning: ignores self-signed SSL certs; use only for the beta

//var signalR = require('signalr-client');
var signalR = require('signalR.js');

var client  = new signalR.client(
    //signalR service URL
    "wss://at0.cloudapp.net:8080/signalr",

    // array of hubs to be supported in the connection
    ['chathub']
    //['chathub','messagehub','tradehub']
    //['chathub','messagehub','tradehub','authhub','historyhub']
);

var colors = null;
try {
  colors = require('colors/safe');
} catch (e) {
}

function print_chat_line(name, color, message, message_time) {
  var name_with_color="";
  var message_date=message_time.substr(0, 10);
  var message_minute=message_time.substr(11, 8);

  if ((typeof this.old_date == 'undefined') || (this.old_date!=message_date)) {
    console.log(message_date);
    this.old_date=message_date;
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
  } else if (color==='purple') {
    name_with_color=colors.magenta(name);
  } else if (color==='pink') {
    name_with_color=colors.rainbow(name);
  } else if (color==='green') {
    name_with_color=colors.green(name);
  } else if (color==='red') {
    name_with_color=colors.red(name);
  } else if (color==='orange') {
    name_with_color=colors.yellow(name);
  } else {
    name_with_color=colors.cyan(name);
  }
  console.log(message_minute+" "+name_with_color + ": " + message);

  return true;
}

client.on(
  'ChatHub',
  'chatRX',
  print_chat_line
);

var callbacks=[]; //TODO: Use OOP

client.serviceHandlers.bound = function() { console.log("Websocket bound"); }
client.serviceHandlers.connectFailed = function(error) { console.log("Websocket connectFailed: ", error); }
client.serviceHandlers.connected = function(connection) { console.log("Websocket connected"); };
client.serviceHandlers.disconnected = function() { console.log("Websocket disconnected"); }
client.serviceHandlers.onerror = function(error) { console.log("Websocket onerror: ", error); }
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
//      console.log("Websocket messageReceived: ", message);
    }
  }
  return false;
}
client.serviceHandlers.bindingError = function (error) { console.log("Websocket bindingError: ", error); }

client.serviceHandlers.connectionLost = function(error) {
     console.log("Connection Lost: ", error);
}

function rpc(args, callback) {
  var messageID=JSON.parse(client.invoke.apply(null, args)).I;
  callbacks[messageID]=callback;
  //console.log(messageID);
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
    console.log("Websocket reconnected");
    var backlog=10;
    if (process.argv[2]>0) {
      backlog=process.argv[2];
    }

    rpc(['chatHub','Subscribe','en']); //there's a race condition if more messages arrive before GetMessages finishes
    GetMessages('en', 0, backlog);
};

client.serviceHandlers.reconnecting = function(retry /* { inital: true/false, count: 0} */) {
    console.log("Websocket Retrying: ", retry);
    return retry.count >= 3; /* cancel retry true */
}
