"use strict;"

var ATSession = require('atsession');
var session  = new ATSession();
var Table = require('cli-table');

var min_balance=0.00001;

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

//Name, Coin, AvailableBalance
function GetBalancesR(balances) {
  var table = new Table({
    head: ['name', 'coin', 'avail bal', 'hold bal', 'total bal', 'est btc', 'est usd'],
    colWidths: [18, 7, 18, 18, 18, 18, 9],
    chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
  });

  balances.forEach(function(bal) {
    if (bal.EstBTC>min_balance) {
      var tot=bal.AvailableBalance+bal.HoldBalance;
      table.push([bal.Name, bal.Coin, bal.AvailableBalance.toFixed(8), bal.HoldBalance.toFixed(8), tot.toFixed(8), bal.EstBTC.toFixed(8), bal.EstUSD.toFixed(2)]);
    }
  });
  console.log(table.toString());

  return true;
}

new_min=process.argv[2];
if (new_min) {
  if (isNaN(parseInt(new_min))) {
    console.log(new_min, "is not a number (should be the minimum balance which you want to display)");
    process.exit();
  } else {
    min_balance=parseInt(new_min);
  }
}

session.rpc('infoHub', 'getBalances', [], function(ret) {
GetBalancesR(ret);
process.exit();
});
