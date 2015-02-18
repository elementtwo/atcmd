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

//"Coin":"SKC","Partner":"BTC","Cost":0.0001,"Id":1234,"Price":0.0000002,"Quantity":500.0,"UserOwned":true
function GetOpenOrdersR(orders, BorS) {
  var table = new Table({
    head: ['id', 'coin', 'ptnr', 'quant', 'price'],
    colWidths: [9, 7, 7, 18, 18],
    chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
  });

  orders.forEach(function(order) {
    table.push([BorS+order.Id, order.Coin, order.Partner, order.Quantity, order.Price.toFixed(8)]);
  });
  console.log(table.toString());

  return true;
}

session.rpc('infoHub', 'getAllOpenBuyOrders', [], function(ret) {
session.rpc('infoHub', 'getAllOpenSellOrders', [], function(ret) {
GetOpenOrdersR(ret, 'S');
process.exit();
});
return GetOpenOrdersR(ret, 'B');
});
