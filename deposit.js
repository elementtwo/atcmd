var ATSession = require('atsession');
var session  = new ATSession();

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
session.usepin(success, failure);
//var coin=process.argv[2];
//var qty=process.argv[3];
//var addr=process.argv[4];
//if (qty>0) {
//  session.rpc('walletHub','withdrawCoins', [coin, qty, addr], null);
//}
session.rpc('walletHub', 'getPendingDeposits', [], null);
