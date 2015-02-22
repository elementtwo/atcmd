var ATSession = require('atsession');
var session  = new ATSession();
var common=require('./common.js');

var flag=1;

function success() {
  console.log("logged in");
}

function failure() {
  console.log("authentication failure");
  process.exit();
}

session.set_debug_level(2); // 2 = verbose
session.set_debug_level(0); // 0 = none
session.start();
session.useauthtoken(success, failure);

gpd(session, process.exit, console.log);
