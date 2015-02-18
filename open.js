"use strict;"

var ATSession = require('atsession');
var session  = new ATSession();
var Table = require('cli-table');
var max_orders=12;

session.set_debug_level(2); // 2 = verbose
session.set_debug_level(0); // 0 = none
session.start();

function GetOpenBuyOrdersR(ordergroups) {
  var table = new Table({
    head: ['price', 'quantity', 'cost', 'count'],
    colWidths: [18, 18, 18, 8],
    chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
  });

  var num_ogs=ordergroups.length;
  var i;
  i=(num_ogs>max_orders) ? max_orders : num_ogs;

  for (i--; i>=0; i--) {
    var og=ordergroups[i];
    table.push([og.Price.toFixed(8),og.Quantity,og.Cost,og.Count]);
  }
  console.log(table.toString());

  return true;
}

function GetOpenSellOrdersR(ordergroups) {
  var table = new Table({
    head: ['price', 'quantity', 'cost', 'count'],
    colWidths: [18, 18, 18, 8],
    chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
  });

  ordergroups.forEach(function(og, idx) {
    if (idx>=max_orders) {return false;}
    table.push([og.Price.toFixed(8),og.Quantity,og.Cost,og.Count]);
  });
  console.log(table.toString());

  return true;
}

var coin=process.argv[2];
var ptnr=process.argv[3];
session.rpc('infoHub', 'getOpenBuyOrders', [coin,ptnr], function(ret) {
session.rpc('infoHub', 'getOpenSellOrders', [coin,ptnr], function(ret) {
GetOpenSellOrdersR(ret);
process.exit();
});
return GetOpenBuyOrdersR(ret);
});
