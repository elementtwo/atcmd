var ATSession = require('atsession');
var session  = new ATSession();

var flag=1;

function success() {
  console.log("logged in");
}

function failure() {
  console.log("authentication failure");
  process.exit();
}

function gpd() {
  session.rpc('walletHub', 'getPendingDeposits', [], GetPendingDepositsR);
}

function GetPendingDepositsR(res) {
  console.log(res);
  if (res.length>0) {
    flag=0;
    setTimeout(gpd, 120000); //120 seconds
    return true;
  } else if (flag) {
    setTimeout(gpd, 120000); //120 seconds
    return true;
  } else {
    process.exit();
  }
}

session.set_debug_level(2); // 2 = verbose
session.set_debug_level(0); // 0 = none
session.start();
session.useauthtoken(success, failure);
session.usepin(success, failure);

gpd();
