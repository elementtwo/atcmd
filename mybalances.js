"use strict;"

var ATSession = require('atsession');
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

//Name, Coin, AvailableBalance
function GetBalancesR(balances) {
  var table = new Table({
    head: ['name', 'coin', 'avail bal', 'hold bal', 'total bal', 'btc equiv'],
    colWidths: [18, 7, 18, 18, 18, 18],
    chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
  });

  balances.forEach(function(bal) {
    var tot=bal.AvailableBalance+bal.HoldBalance;
    table.push([bal.Name, bal.Coin, bal.AvailableBalance.toFixed(8), bal.HoldBalance.toFixed(8), tot.toFixed(8), bal.EstBTC.toFixed(8)]);
  });
  console.log(table.toString());

  return true;
}

session.rpc('infoHub', 'getBalances', [], function(ret) {
GetBalancesR(ret);
process.exit();
});
