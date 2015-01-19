"use strict;"

var ATSession = require('atsession');
var tardy = require('tardy.js');
var session  = new ATSession();
var Table = require('cli-table');

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

function callback(res) {
  console.log(res);
  process.exit();
}

var id=process.argv[2];
if (id[0]==='B') {
  session.rpc('tradeHub', 'deleteBuyOrder', [id.slice(1)], callback);
} else if (id[0]==='S') {
  session.rpc('tradeHub', 'deleteSellOrder', [id.slice(1)], callback);
} else {
  console.log("invalid trade id");
  process.exit();
}
