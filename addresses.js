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

//Address, CCSEnabled, Coin, IsFiat, Name, PryptoEnabled, Min
function GetAllAddressesR(addresses) {
  var table = new Table({
    head: ['coin', 'name', 'address', 'min'],
    colWidths: [8, 18, 45, 8],
    chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
  });

  addresses.forEach(function(add) {
    table.push([add.Coin, add.Name, add.Address, add.Min]);
  });
  console.log(table.toString());

  process.exit();

  return true;
}

if (process.argv[2]) {
  var coin=process.argv[2];
  session.rpc('walletHub','getNewRXAddress', [coin], function(ret) {
    session.rpc('walletHub','getAllAddresses', [], GetAllAddressesR);
  });
} else {
  session.rpc('walletHub','getAllAddresses', [], GetAllAddressesR);
}
