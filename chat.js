//var signalR = require('signalr-client');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var signalR = require('signalR.js');
var client  = new signalR.client(

    //signalR service URL
    "wss://at0.cloudapp.net:8080/signalr",

    // array of hubs to be supported in the connection
    ['chathub']
    //['chathub','messagehub','tradehub']
    //['chathub','messagehub','tradehub','authhub','historyhub']
);
var colors = require('colors/safe');

client.on(
  'ChatHub',
  'chatRX',
  function(name, color, message, time) {
    var name_with_color="";
    if (color==='black') {
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
    console.log(name_with_color + ": " + message);

    return true;
  });

client.serviceHandlers.bound = function() { console.log("Websocket bound"); }
client.serviceHandlers.connectFailed = function(error) { console.log("Websocket connectFailed: ", error); }
client.serviceHandlers.connected = function(connection) { console.log("Websocket connected"); };
client.serviceHandlers.disconnected = function() { console.log("Websocket disconnected"); }
client.serviceHandlers.onerror = function(error) { console.log("Websocket onerror: ", error); }
//client.serviceHandlers.messageReceived = function (message) { console.log("Websocket messageReceived: ", message); return false; }
//client.serviceHandlers.bindingError = function (error) { console.log("Websocket bindingError: ", error); }

client.serviceHandlers.connectionLost = function(error) {
     console.log("Connection Lost: ", error);
}
client.serviceHandlers.reconnected = function(connection) {
    console.log("Websocket reconnected");
    //client.invoke('chatHub','ListChannels');
    //client.invoke('chatHub','GetMessages','en',0,1000);
    //client.invoke('chatHub','GetMessages','gl',0,1000);
    client.invoke('chatHub','Subscribe','gl');
    client.invoke('chatHub','Subscribe','en');
};
client.serviceHandlers.reconnecting = function(retry /* { inital: true/false, count: 0} */) {
    console.log("Websocket Retrying: ", retry);
    return retry.count >= 3; /* cancel retry true */
}
