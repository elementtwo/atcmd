var ATSession = require('atsession');
var session  = new ATSession();
var cs = require('coinstring');

function success() {
  console.log("logged in");
}

function failure() {
  console.log("authentication failure");
  process.exit();
}

function gpw() {
  session.rpc('walletHub', 'getPendingWithdrawals', [], GetPendingWithdrawalsR);
}

function GetPendingWithdrawalsR(res) {
  console.log(res);
  if (res.length>0) {
    setTimeout(gpw, 120000); //120 seconds
    return true;
  } else {
    process.exit();
  }
}

function WithdrawCoinsR(res) {
  console.log(res);
  gpw();
}

session.set_debug_level(2); // 2 = verbose
session.set_debug_level(0); // 0 = none
session.start();
session.useauthtoken(success, failure);
session.usepin(success, failure);
var coin=process.argv[2];
var qty=process.argv[3];
var addr=process.argv[4];
if (qty>0) {
  try {
    var d = cs.decode(addr);
    console.log(d);
    session.rpc('walletHub','withdrawCoins', [coin, qty, addr], WithdrawCoinsR);
  } catch (e) {
    console.log('bad address');
    process.exit();
  }
} else {
  gpw();
}
