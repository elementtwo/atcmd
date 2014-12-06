var ATSession = require('atsession.js');
var tardy = require('tardy.js');
var path = require('path');

var session  = new ATSession();
session.set_debug_level(0); // 0 = none
session.set_debug_level(2); // 2 = verbose
session.start();
var fs = require('fs');
try {
var globalusername=fs.readFileSync("username", {encoding: 'ascii'});
var globalpassword=fs.readFileSync("password", {encoding: 'ascii'});
} catch (e) {
}

function writeToFile(fname, data) {
  try { fs.mkdirSync(session.confdir); } catch (e) {}
  fs.writeFile(path.join(session.confdir, fname), data, function(err) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    if (err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
    process.exit();
  }); 
}

function success(authtoken) {
  tardy.output("DoAuthR success ", authtoken);
  writeToFile("authtoken", authtoken);
  writeToFile("username", globalusername);
  writeToFile("password", globalpassword);
  writeToFile("pin", globalpin);
}

function failure() {
  tardy.output("DoAuthR failed");
  process.exit();
}

if (globalpassword) {
  session.login(globalusername, globalpassword, success, failure);
} else {
  tardy.question("Username: ", false, function(username) {
    tardy.question("Password: ", false, function(password) {
      tardy.question("PIN: ", false, function(pin) {
        globalusername=username;
        globalpassword=password;
        globalpin=pin;
        session.login(username, password, success, failure);
      });
    });
  });
}