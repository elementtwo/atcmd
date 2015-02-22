//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //warning: ignores self-signed SSL certs; use only for the beta

var ATSession = require('atsession');
var colors = null;
try {
  colors = require('colors/safe');
} catch (e) {
}
var tardy = require('tardy.js');
var state;
var globalauthtoken="";
var globalusername="";
var globalpassword="";

var globalolddate="";

function print_chat_msg(msg) {
  //var channel=msg.Channel;
  var id=msg.Id;
  var name=msg.Username;
  var color=msg.Color;
  var message=msg.Message;
  var message_time=msg.Created;

  print_chat_line(name, color, message, message_time, id);
}

function print_chat_line(name, color, message, message_time, id) {
  var name_with_color="";
  var message_minute;

  if (message_time) {
    var message_date=message_time.substr(0, 10);
    message_minute=message_time.substr(11, 8);

    if (message_date&&(globalolddate!==message_date)) {
      tardy.output(message_date);
      globalolddate=message_date;
    }
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
  } else if (color==='green') {
    name_with_color=colors.green(name);
  } else if (color==='red') {
    name_with_color=colors.red(name);
  } else if (color==='orange') {
    name_with_color=colors.yellow(name);
  } else {
    name_with_color=colors.cyan(name);
  }

  if (id) {
    tardy.output(id+": "+message_minute+" "+name_with_color + ": " + message);
  } else {
    tardy.output(message_minute+" "+name_with_color + ": " + message);
  }

  return true;
}

function onSubscribed(channel, r) {
  if (r) {
    tardy.output("Subscribed to "+channel);
  } else {
    tardy.output("Subscribe to "+channel+" failed");
  }
  session.getBacklog(channel, 10, print_chat_msg); 
  return true;
}

function login() {
  session.login(globalusername, globalpassword, login_success, login_failure);
}

function onLogout() {
  tardy.output("onLogout()");
  subscribeAll(session);
  login();
}

function subscribeAll(session) {
  session.subscribe('en', function(r) {return onSubscribed('en', r)});
  session.subscribe('gl', function(r) {return onSubscribed('gl', r)});
}

var session  = new ATSession();
session.set_debug_level(0);
//session.setBaseURL("https://ws.atomic-trade.com/signalr");
//session.setHubs(['chathub']);
session.setOutput(tardy.output);
session.set_print_chat_line(print_chat_line);
session.onLogout(onLogout);
session.start();
subscribeAll(session);

function login_failure() {
  getcreds();
}

function login_success() {
  tardy.onLine(handle_line);
  tardy.tardy();
}

function getcreds() {
  tardy.question("Username: ", true, function(username) {
    tardy.question("Password: ", true, function(password) {
      globalusername=username;
      globalpassword=password;
      login();
    });
  });
}

session.useauthtoken(login_success, login_failure);
//getcreds();

var common=require('./common.js');

function handle_line(line) {
  if (line === '/deposit') {
    common.gpd(session, null, tardy.output);
  } else {
    session.SendMessage(line, 'en');
  }
}
