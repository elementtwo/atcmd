var ATSession = require('atsession');
var tardy = require('tardy.js');
var path = require('path');

var session  = new ATSession();
session.set_debug_level(2); // 2 = verbose
session.set_debug_level(0); // 0 = none
session.start();
var fs = require('fs');
var globalcode;
var globalpin;
try {
  var globalusername=fs.readFileSync(filename("username"), {encoding: 'ascii'});
  var globalpassword=fs.readFileSync(filename("password"), {encoding: 'ascii'});
} catch (e) {
  //console.log("read error");
}

function filename(fname) {
  return path.join(session.confdir, fname);
}

function writeToFile(fname, data) {
  try { fs.mkdirSync(session.confdir); } catch (e) {}
  fs.writeFile(filename(fname), data, function(err) {
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
  if ((typeof globalpin === 'number')&&(globalpin>0)) {
    writeToFile("pin", globalpin);
  }
}

function failure() {
  tardy.output("DoAuthR failed");
  process.exit();
}

if (globalpassword) {
  tardy.output("Your credentials were stored in "+session.confdir+". Use logout.js to delete them.");
  session.login(globalusername, globalpassword, success, failure);
} else {
  tardy.output("Your credentials will be stored in "+session.confdir+". Use logout.js to delete them.");
  tardy.question("Username: ", false, function(username) {
    tardy.question("Password: ", false, function(password) {
      tardy.question("PIN (optional): ", false, function(pin) {
        tardy.question("2FA (if needed): ", false, function(code) {
          globalusername=username;
          globalpassword=password;
          globalpin=parseInt(pin);
          globalcode=code;
          if (code>0) {
            session.login2fa(username, password, code, success, failure);
          } else {
            session.login(username, password, success, failure);
          }
        });
      });
    });
  });
}
